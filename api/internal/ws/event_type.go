package ws

type WsEventType string

const (
	ReceiveMessageEventType WsEventType = "receive_message"
	SendMessageEventType    WsEventType = "send_message"

	JoinedLobbyEventType     WsEventType = "joined_lobby"
	LeavedLobbyEventType     WsEventType = "leaved_lobby"
	JoinBroadcastEventType   WsEventType = "join_broadcast"
	JoinedBroadcastEventType WsEventType = "joined_broadcast"
)
