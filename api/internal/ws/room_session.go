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
		msg := <-s.Message
		s.HandleMessage(msg)
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
	case JoinedLobbyEventType:
		s.HandleJoinedLobbyEvent(msg)
	case LeavedLobbyEventType:
		s.HandleLeavedLobbyEvent(msg)
	case JoinBroadcastEventType:
		s.HandleJoinBroadcastEvent(msg)
	case RtcSendAnswerEventType:
		s.HandleRtcSendAnswerEvent(msg)
	case RtcSendOfferEventType:
		s.HandleRtcSendOfferEvent(msg)
	case RtcSendCandidateEventType:
		s.HandleRtcSendCandidateEvent(msg)
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

func (s *WsRoomSession) BroadcastTarget(msg []byte, targetId uint) {
	slog.Info("broadcast target", "msg", msg, "target", targetId)
	if cs, ok := s.Clients[targetId]; ok {
		cs.SendQueue <- msg
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

func (s *WsRoomSession) HandleJoinedLobbyEvent(msg *WsClientMessage) {
	var event WsJoinedLobbyEvent
	if err := json.Unmarshal(msg.Raw, &event); err != nil {
		slog.Error("cannot unmarshal msg on joined lobby event", "err", err, "raw", string(msg.Raw))
		return
	}

	s.BroadcastOthers(event.ToRaw(), msg.Sender)
}

func (s *WsRoomSession) HandleLeavedLobbyEvent(msg *WsClientMessage) {
	var event WsLeavedLobbyEvent
	if err := json.Unmarshal(msg.Raw, &event); err != nil {
		slog.Error("cannot unmarshal msg on leaved lobby event", "err", err, "raw", string(msg.Raw))
		return
	}

	s.BroadcastOthers(event.ToRaw(), msg.Sender)
}

func (s *WsRoomSession) HandleJoinBroadcastEvent(msg *WsClientMessage) {
	var event WsJoinBroadcastEvent
	if err := json.Unmarshal(msg.Raw, &event); err != nil {
		slog.Error("cannot unmarshal msg on leaved lobby event", "err", err, "raw", string(msg.Raw))
		return
	}

	msg.Client.Status = WsClientSessionStatusJoinedBroadcast

	response := &WsJoinedBroadcastEvent{
		WsBaseEvent: WsBaseEvent{Type: JoinedBroadcastEventType},
		UserId:      msg.Sender,
	}

	for id, c := range s.Clients {
		if id == msg.Sender || c.Status == WsClientSessionStatusJoinedLobby {
			continue
		}
		select {
		case c.SendQueue <- response.ToRaw():
			slog.Info("broadcast to", "id", c.UserId)
		default:
			slog.Warn("send queue full, dropping message", "id", c.UserId)
		}
	}
}

func (s *WsRoomSession) HandleRtcSendOfferEvent(msg *WsClientMessage) {
	var event WsRtcSendOfferEvent
	if err := json.Unmarshal(msg.Raw, &event); err != nil {
		slog.Error("cannot unmarshal msg on send rtc offer event", "err", err, "raw", string(msg.Raw))
		return
	}

	response := &WsRtcReceiveOfferEvent{
		WsBaseEvent: WsBaseEvent{Type: RtcReceiveOfferEventType},
		Target:      event.Target,
		Sender:      msg.Sender,
		Sdp:         event.Sdp,
	}

	s.BroadcastTarget(response.ToRaw(), event.Target)
}

func (s *WsRoomSession) HandleRtcSendAnswerEvent(msg *WsClientMessage) {
	var event WsRtcSendAnswerEvent
	if err := json.Unmarshal(msg.Raw, &event); err != nil {
		slog.Error("cannot unmarshal msg on rtc answer event", "err", err, "raw", string(msg.Raw))
		return
	}

	response := &WsRtcReceiveAnswerEvent{
		WsBaseEvent: WsBaseEvent{Type: RtcReceiveAnswerEventType},
		Target:      event.Target,
		Sender:      msg.Sender,
		Sdp:         event.Sdp,
	}

	s.BroadcastTarget(response.ToRaw(), event.Target)
}

func (s *WsRoomSession) HandleRtcSendCandidateEvent(msg *WsClientMessage) {
	var event WsRtcSendCandidateEvent
	if err := json.Unmarshal(msg.Raw, &event); err != nil {
		slog.Error("cannot unmarshal msg on rtc candidate event", "err", err, "raw", string(msg.Raw))
		return
	}

	response := &WsRtcReceiveCandidateEvent{
		WsBaseEvent: WsBaseEvent{Type: RtcReceiveCandidateEventType},
		Target:      event.Target,
		Sender:      msg.Sender,
		Candidate:   event.Candidate,
	}

	s.BroadcastTarget(response.ToRaw(), event.Target)
}
