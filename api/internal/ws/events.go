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
