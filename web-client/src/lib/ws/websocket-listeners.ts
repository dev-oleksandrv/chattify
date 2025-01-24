import { roomMessages } from '../../store/room-store';
import type { WsReceiveMessageEvent } from './websocket-events';

export const receiveMessageListener = (data: WsReceiveMessageEvent) => {
	roomMessages.update((msgs) => [
		...msgs,
		{
			content: data.content
		}
	]);
};
