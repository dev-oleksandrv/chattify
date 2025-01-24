package ws

import (
	"log/slog"

	"github.com/gorilla/websocket"
)

type WsClientSessionStatus string

type WsClientSession struct {
	Room      *WsRoomSession
	UserId    uint
	Socket    *websocket.Conn
	SendQueue chan []byte
	Status    WsClientSessionStatus
}

func (c *WsClientSession) Read() {
	for {
		_, msg, err := c.Socket.ReadMessage()
		if err != nil {
			if websocket.IsCloseError(err, websocket.CloseGoingAway) {
				slog.Info("client disconnected", "userId", c.UserId)
			} else {
				slog.Error("error while reading message", "err", err, "userId", c.UserId)
			}
			return
		}

		c.Room.Message <- &WsClientMessage{
			Sender: c.UserId,
			Raw:    msg,
		}
	}
}

func (c *WsClientSession) Write() {
	defer func() {
		c.Socket.Close()
		slog.Info("Write goroutine exiting", "userId", c.UserId)
	}()
	for msg := range c.SendQueue {
		slog.Info("sending message to client", "msg", string(msg))
		if err := c.Socket.WriteMessage(websocket.TextMessage, msg); err != nil {
			slog.Error("error while sending message", "err", err, "userId", c.UserId)
			return // Exit the loop on error
		}
	}
}

const (
	WsClientSessionStatusJoinedLobby     WsClientSessionStatus = "joined_lobby"
	WsClientSessionStatusJoinedBroadcast WsClientSessionStatus = "joined_broadcast"
)
