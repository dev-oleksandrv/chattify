export interface WsReceiveMessageEvent extends WsBaseEvent {
	type: WsEventType.ReceiveMessage;
	content: string;
}

export interface WsSendMessageEvent extends WsBaseEvent {
	type: WsEventType.SendMessage;
	content: string;
}

export interface WsJoinedLobbyEvent extends WsBaseEvent {
	type: WsEventType.SendMessage;
	userId: number;
}

export interface WsLeavedLobbyEvent extends WsBaseEvent {
	type: WsEventType.LeavedLobby;
	userId: number;
}

export interface WsBaseEvent {
	type: WsEventType;
}

export enum WsEventType {
	ReceiveMessage = 'receive_message',
	SendMessage = 'send_message',
	JoinedLobby = 'joined_lobby',
	LeavedLobby = 'leaved_lobby'
}
