package ws

import (
	"fmt"
	"log/slog"
	"net/http"
	"strconv"
	"sync"

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
	roomsLock         sync.RWMutex
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

	slog.Info("handshake", "user", user.ID)

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

	roomIdUint := uint(roomId)

	room, ok := h.getRoom(roomIdUint)
	if ok {
		if _, ok := room.Clients[user.ID]; ok {
			return echo.NewHTTPError(http.StatusForbidden, "user already connected to room")
		}

		if len(room.Clients) >= 5 {
			return echo.NewHTTPError(http.StatusForbidden, "max limit of users in room exceeded")
		}
	}

	token := uuid.New()
	h.handshakeSessions[token] = &WsHandshakeSession{
		User:   user,
		RoomId: roomIdUint,
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
	roomId := uint(details.RoomId)

	delete(h.handshakeSessions, token)

	socket, err := h.upgrader.Upgrade(c.Response().Writer, c.Request(), nil)
	if err != nil {
		slog.Error("cannot upgrade http request to ws", "err", err)
		return err
	}

	if _, ok := h.getRoom(roomId); !ok {
		h.createRoom(roomId)
	}

	go h.rooms[roomId].Read()

	clientSession := &WsClientSession{
		Room:      h.rooms[roomId],
		Socket:    socket,
		SendQueue: make(chan []byte),
		Status:    WsClientSessionStatusJoinedLobby,
		UserDetails: &WsClientSessionUserDetails{
			ID:           user.ID,
			Username:     user.Username,
			AvatarURL:    user.AvatarURL,
			VideoEnabled: true,
			AudioEnabled: true,
		},
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
			room, ok := h.getRoom(cs.Room.Id)
			if !ok {
				slog.Error("cannot find room while join user")
				return
			}

			room.AddClient(cs)
			room.NotifyRoom(cs)
			room.EstablishConnection(cs)

		case cs := <-h.leave:
			room, ok := h.getRoom(cs.Room.Id)
			if !ok {
				return
			}
			room.RemoveClient(cs)

			event := &WsLeavedLobbyEvent{
				WsBaseEvent: WsBaseEvent{Type: LeavedLobbyEventType},
				UserId:      cs.UserDetails.ID,
			}
			room.Message <- &WsClientMessage{
				Sender: cs.UserDetails.ID,
				Raw:    event.ToRaw(),
				Client: cs,
			}

			if room.IsEmpty() {
				delete(h.rooms, cs.Room.Id)
			}
		}
	}
}

func (h *WsHandler) getRoom(id uint) (*WsRoomSession, bool) {
	h.roomsLock.Lock()
	defer h.roomsLock.Unlock()
	room, ok := h.rooms[id]
	return room, ok
}

func (h *WsHandler) createRoom(id uint) *WsRoomSession {
	h.roomsLock.Lock()
	defer h.roomsLock.Unlock()
	if _, exists := h.rooms[id]; !exists {
		h.rooms[id] = &WsRoomSession{
			Id:      id,
			Clients: make(map[uint]*WsClientSession),
			Message: make(chan *WsClientMessage),
		}
	}
	return h.rooms[id]
}
