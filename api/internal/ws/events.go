package ws

import (
	"encoding/json"
	"log/slog"
)

type WsSendMessageEvent struct {
	WsBaseEvent
	Content string `json:"content"`
}

type WsReceiveMessageEvent struct {
	WsBaseEvent
	Content string `json:"content"`
}

type WsJoinBroadcastEvent struct {
	WsBaseEvent
}

type WsJoinedBroadcastEvent struct {
	WsBaseEvent
	UserId uint `json:"userId"`
}

func (e *WsJoinedBroadcastEvent) ToRaw() []byte {
	return e.WsBaseEvent.ToRaw(e)
}

type WsLeavedBroadcastEvent struct {
	WsBaseEvent
	UserId uint `json:"userId"`
}

func (e *WsLeavedBroadcastEvent) ToRaw() []byte {
	return e.WsBaseEvent.ToRaw(e)
}

type WsJoinedLobbyEvent struct {
	WsBaseEvent
	UserId uint `json:"userId"`
}

func (e *WsJoinedLobbyEvent) ToRaw() []byte {
	return e.WsBaseEvent.ToRaw(e)
}

type WsLeavedLobbyEvent struct {
	WsBaseEvent
	UserId uint `json:"userId"`
}

func (e *WsLeavedLobbyEvent) ToRaw() []byte {
	return e.WsBaseEvent.ToRaw(e)
}

type WsRtcSendOfferEvent struct {
	WsBaseEvent
	Target uint   `json:"target"`
	Sdp    string `json:"sdp"`
}

type WsRtcSendAnswerEvent struct {
	WsBaseEvent
	Target uint   `json:"target"`
	Sdp    string `json:"sdp"`
}

type WsRtcSendCandidateEvent struct {
	WsBaseEvent
	Target    uint   `json:"target"`
	Candidate string `json:"candidate"`
}

type WsRtcReceiveOfferEvent struct {
	WsBaseEvent
	Target uint   `json:"target"`
	Sender uint   `json:"sender"`
	Sdp    string `json:"sdp"`
}

func (e *WsRtcReceiveOfferEvent) ToRaw() []byte {
	return e.WsBaseEvent.ToRaw(e)
}

type WsRtcReceiveAnswerEvent struct {
	WsBaseEvent
	Target uint   `json:"target"`
	Sender uint   `json:"sender"`
	Sdp    string `json:"sdp"`
}

func (e *WsRtcReceiveAnswerEvent) ToRaw() []byte {
	return e.WsBaseEvent.ToRaw(e)
}

type WsRtcReceiveCandidateEvent struct {
	WsBaseEvent
	Target    uint   `json:"target"`
	Sender    uint   `json:"sender"`
	Candidate string `json:"candidate"`
}

func (e *WsRtcReceiveCandidateEvent) ToRaw() []byte {
	return e.WsBaseEvent.ToRaw(e)
}

type WsBaseEvent struct {
	Type WsEventType `json:"type"`
}

type RawConvertible interface {
	ToRaw() []byte
}

func (e *WsBaseEvent) ToRaw(event RawConvertible) []byte {
	val, err := json.Marshal(event)
	if err != nil {
		slog.Warn("cannot map to struct to raw", "err", err)
		return []byte("")
	}

	return val
}
