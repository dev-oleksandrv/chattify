package ws

import (
	"fmt"
	"log/slog"
	"net/http"
	"strconv"

	"github.com/dev-oleksandrv/chattify-api/internal/auth"
	"github.com/dev-oleksandrv/chattify-api/internal/user"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
)

type WsHandler struct {
	upgrader          *websocket.Upgrader
	join              chan *WsClientSession
	leave             chan *WsClientSession
	rooms             map[uint]*WsRoomSession
	handshakeSessions map[uuid.UUID]*WsHandshakeSession
}

func NewWsHandler() *WsHandler {
	upgrader := &websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 256,
		CheckOrigin:     func(r *http.Request) bool { return true },
	}

	return &WsHandler{
		upgrader:          upgrader,
		join:              make(chan *WsClientSession),
		leave:             make(chan *WsClientSession),
		rooms:             make(map[uint]*WsRoomSession),
		handshakeSessions: make(map[uuid.UUID]*WsHandshakeSession),
	}
}

func (h *WsHandler) HandshakeHandlerFunc(c echo.Context) error {
	user := c.Get(auth.AuthUserDataContextKey).(*user.UserDto)

	roomIdRaw := c.Request().Header.Get("X-Room-Id")
	if roomIdRaw == "" {
		err := fmt.Errorf("room id is required to connect to ws")
		slog.Error("error while receiving roomId", "err", err)
		return err
	}

	roomId, err := strconv.Atoi(roomIdRaw)
	if err != nil {
		slog.Error("error while parsing roomId", "err", err)
		return err
	}

	token := uuid.New()

	h.handshakeSessions[token] = &WsHandshakeSession{
		User:   user,
		RoomId: uint(roomId),
		Token:  token,
	}

	return c.JSON(http.StatusOK, &WsHandshakeSessionResponse{
		Token: token.String(),
	})
}

func (h *WsHandler) HandlerFunc(c echo.Context) error {
	rawToken := c.QueryParams().Get("token")
	if rawToken == "" {
		err := fmt.Errorf("token is required to connect to ws")
		slog.Error("error while receiving token", "err", err)
		return err
	}

	token, err := uuid.Parse(rawToken)
	if err != nil {
		slog.Error("error while parsing token", "err", err)
		return err
	}

	details, ok := h.handshakeSessions[token]
	if !ok {
		err := fmt.Errorf("token is invalid")
		slog.Error("error while checking token", "err", err)
		return err
	}

	user := details.User
	roomId := details.RoomId

	delete(h.handshakeSessions, token)

	socket, err := h.upgrader.Upgrade(c.Response().Writer, c.Request(), nil)
	if err != nil {
		slog.Error("cannot upgrade http request to ws", "err", err)
		return err
	}

	if _, ok := h.rooms[uint(roomId)]; !ok {
		h.rooms[uint(roomId)] = &WsRoomSession{
			Id:      uint(roomId),
			Clients: make(map[uint]*WsClientSession),
			Message: make(chan *WsClientMessage),
		}

		go h.rooms[uint(roomId)].Read()
	}

	clientSession := &WsClientSession{
		Room:      h.rooms[uint(roomId)],
		UserId:    user.ID,
		Socket:    socket,
		SendQueue: make(chan []byte),
		Status:    WsClientSessionStatusJoinedLobby,
	}

	h.join <- clientSession
	defer func() { h.leave <- clientSession }()

	go clientSession.Write()
	clientSession.Read()

	return nil
}

func (h *WsHandler) Run() {
	for {
		select {
		case cs := <-h.join:
			slog.Info("joined")
			h.rooms[cs.Room.Id].AddClient(cs)

			event := &WsJoinedLobbyEvent{
				WsBaseEvent: WsBaseEvent{Type: JoinedLobbyEventType},
				UserId:      cs.UserId,
			}
			h.rooms[cs.Room.Id].Message <- &WsClientMessage{
				Sender: cs.UserId,
				Raw:    event.ToRaw(),
				Client: cs,
			}

		case cs := <-h.leave:
			slog.Info("leaved")
			h.rooms[cs.Room.Id].RemoveClient(cs)

			event := &WsLeavedLobbyEvent{
				WsBaseEvent: WsBaseEvent{Type: LeavedLobbyEventType},
				UserId:      cs.UserId,
			}
			h.rooms[cs.Room.Id].Message <- &WsClientMessage{
				Sender: cs.UserId,
				Raw:    event.ToRaw(),
				Client: cs,
			}

			if h.rooms[cs.Room.Id].IsEmpty() {
				delete(h.rooms, cs.Room.Id)
			}
		}
		slog.Info("rooms", "rooms", h.rooms)
	}
}
