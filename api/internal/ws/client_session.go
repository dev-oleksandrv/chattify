package ws

import (
	"log/slog"

	"github.com/gorilla/websocket"
)

type WsClientSessionStatus string

type WsClientSession struct {
	Socket      *websocket.Conn
	Room        *WsRoomSession
	Status      WsClientSessionStatus
	SendQueue   chan []byte
	UserDetails *WsClientSessionUserDetails
}

func (c *WsClientSession) Read() {
	for {
		_, msg, err := c.Socket.ReadMessage()
		if err != nil {
			if websocket.IsCloseError(err, websocket.CloseGoingAway) {
				slog.Info("client disconnected", "userId", c.UserDetails.ID)
			} else {
				slog.Error("error while reading message", "err", err, "userId", c.UserDetails.ID)
			}
			return
		}

		c.Room.Message <- &WsClientMessage{
			Sender: c.UserDetails.ID,
			Raw:    msg,
			Client: c,
		}
	}
}

func (c *WsClientSession) Write() {
	defer func() {
		c.Socket.Close()
		slog.Info("Write goroutine exiting", "userId", c.UserDetails.ID)
	}()
	for msg := range c.SendQueue {
		slog.Info("sending message to client", "msg", string(msg))
		if err := c.Socket.WriteMessage(websocket.TextMessage, msg); err != nil {
			slog.Error("error while sending message", "err", err, "userId", c.UserDetails.ID)
			return
		}
	}
}

const (
	WsClientSessionStatusJoinedLobby     WsClientSessionStatus = "joined_lobby"
	WsClientSessionStatusJoinedBroadcast WsClientSessionStatus = "joined_broadcast"
)
