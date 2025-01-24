export interface WsReceiveMessageEvent extends WsBaseEvent {
	type: WsEventType.ReceiveMessage;
	content: string;
}

export interface WsSendMessageEvent extends WsBaseEvent {
	type: WsEventType.SendMessage;
	content: string;
}

export interface WsBaseEvent {
	type: WsEventType;
}

export enum WsEventType {
	ReceiveMessage = 'receive_message',
	SendMessage = 'send_message'
}
