package ws

type WsEventType string

const (
	ReceiveMessageEventType WsEventType = "receive_message"
	SendMessageEventType    WsEventType = "send_message"

	JoinedLobbyEventType     WsEventType = "joined_lobby"
	LeavedLobbyEventType     WsEventType = "leaved_lobby"
	JoinBroadcastEventType   WsEventType = "join_broadcast"
	JoinedBroadcastEventType WsEventType = "joined_broadcast"
	LeavedBroadcastEventType WsEventType = "leaved_broadcast"

	RtcSendOfferEventType        WsEventType = "rtc_send_offer"
	RtcSendAnswerEventType       WsEventType = "rtc_send_answer"
	RtcSendCandidateEventType    WsEventType = "rtc_send_candidate"
	RtcReceiveOfferEventType     WsEventType = "rtc_receive_offer"
	RtcReceiveAnswerEventType    WsEventType = "rtc_receive_answer"
	RtcReceiveCandidateEventType WsEventType = "rtc_receive_candidate"
)
