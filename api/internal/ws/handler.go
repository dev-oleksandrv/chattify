package ws

import (
	"fmt"
	"log/slog"
	"strconv"

	"github.com/dev-oleksandrv/chattify-api/internal/auth"
	"github.com/dev-oleksandrv/chattify-api/internal/user"
	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
)

type WsHandler struct {
	upgrader *websocket.Upgrader
	join     chan *WsClientSession
	leave    chan *WsClientSession
	rooms    map[uint]*WsRoomSession
}

func NewWsHandler() *WsHandler {
	upgrader := &websocket.Upgrader{ReadBufferSize: 1024, WriteBufferSize: 256}

	return &WsHandler{
		upgrader: upgrader,
		join:     make(chan *WsClientSession),
		leave:    make(chan *WsClientSession),
		rooms:    make(map[uint]*WsRoomSession),
	}
}

func (h *WsHandler) HandlerFunc(c echo.Context) error {
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
		case cs := <-h.leave:
			slog.Info("leaved")
			h.rooms[cs.Room.Id].RemoveClient(cs)

			if h.rooms[cs.Room.Id].IsEmpty() {
				delete(h.rooms, cs.Room.Id)
			}
		}
		slog.Info("rooms", "rooms", h.rooms)
	}
}
