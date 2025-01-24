export interface RoomMessage {
	content: string;
	type: RoomMessageType;
}

export enum RoomMessageType {
	User,
	System
}
