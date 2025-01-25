export interface RoomMessage {
	content: string;
	type: RoomMessageType;
}

export enum RoomMessageType {
	User,
	System
}

export enum RoomStatus {
	Lobby,
	ConnectingToBroadcast,
	Broadcast
}
