import { roomMessages } from '../../store/room-store';
import { RoomMessageType } from '../../types/room-types';
import type { WsJoinedLobbyEvent, WsReceiveMessageEvent } from './websocket-events';

export const receiveMessageListener = (data: WsReceiveMessageEvent) => {
	roomMessages.update((msgs) => [
		...msgs,
		{
			content: data.content,
			type: RoomMessageType.User
		}
	]);
};

export const joinedLobbyListener = (data: WsJoinedLobbyEvent) => {
	roomMessages.update((msgs) => [
		...msgs,
		{
			content: `User ${data.userId} joined lobby`,
			type: RoomMessageType.System
		}
	]);
};

export const leavedLobbyListener = (data: WsJoinedLobbyEvent) => {
	roomMessages.update((msgs) => [
		...msgs,
		{
			content: `User ${data.userId} leaved lobby`,
			type: RoomMessageType.System
		}
	]);
};
