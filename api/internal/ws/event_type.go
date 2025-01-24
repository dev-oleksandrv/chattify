package ws

type WsEventType string

const (
	ReceiveMessageEventType WsEventType = "receive_message"
	SendMessageEventType    WsEventType = "send_message"
)
