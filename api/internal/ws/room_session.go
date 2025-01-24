package ws

import (
	"encoding/json"
	"log/slog"
)

type WsRoomSession struct {
	Id      uint
	Clients map[uint]*WsClientSession
	Message chan *WsClientMessage
}

func (s *WsRoomSession) Read() {
	for {
		s.HandleMessage(<-s.Message)
	}
}

func (s *WsRoomSession) HandleMessage(msg *WsClientMessage) {
	var baseEvent WsBaseEvent
	if err := json.Unmarshal(msg.Raw, &baseEvent); err != nil {
		slog.Error("cannot unmarshal message", "msg", msg.Raw)
		return
	}

	switch baseEvent.Type {
	case SendMessageEventType:
		s.HandleSendMessageEvent(msg)
	}

}

func (s *WsRoomSession) BroadcastAll(msg []byte) {
	slog.Info("broadcast all", "msg", msg, "clients", s.Clients)
	for _, c := range s.Clients {
		select {
		case c.SendQueue <- msg:
			slog.Info("broadcast to", "id", c.UserId)
		default:
			slog.Warn("send queue full, dropping message", "id", c.UserId)
		}
	}
}

func (s *WsRoomSession) BroadcastOthers(msg []byte, filterId uint) {
	slog.Info("broadcast others", "msg", msg, "clients", s.Clients)
	for id, c := range s.Clients {
		if id == filterId {
			continue
		}
		select {
		case c.SendQueue <- msg:
			slog.Info("broadcast to", "id", c.UserId)
		default:
			slog.Warn("send queue full, dropping message", "id", c.UserId)
		}
	}
}

func (s *WsRoomSession) AddClient(client *WsClientSession) {
	s.Clients[client.UserId] = client
}

func (s *WsRoomSession) RemoveClient(client *WsClientSession) {
	delete(s.Clients, client.UserId)
}

func (s *WsRoomSession) IsEmpty() bool {
	return len(s.Clients) == 0
}

func (s *WsRoomSession) HandleSendMessageEvent(msg *WsClientMessage) {
	var event WsSendMessageEvent
	if err := json.Unmarshal(msg.Raw, &event); err != nil {
		slog.Error("cannot unmarshal msg on send message event", "err", err, "raw", string(msg.Raw))
		return
	}

	serializedResponse, err := json.Marshal(&WsReceiveMessageEvent{
		WsBaseEvent: WsBaseEvent{Type: ReceiveMessageEventType},
		Content:     event.Content,
	})
	if err != nil {
		slog.Error("cannot marshal response msg on receive message event", "err", err)
		return
	}

	s.BroadcastOthers(serializedResponse, msg.Sender)
}
