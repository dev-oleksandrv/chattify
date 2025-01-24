package ws

type WsSendMessageEvent struct {
	WsBaseEvent
	Content string `json:"content"`
}

type WsReceiveMessageEvent struct {
	WsBaseEvent
	Content string `json:"content"`
}

type WsBaseEvent struct {
	Type WsEventType `json:"type"`
}
