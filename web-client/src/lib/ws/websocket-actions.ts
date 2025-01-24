import { roomMessages } from '../../store/room-store';
import type { WsSendMessageEvent } from './websocket-events';
import type { WebsocketManager } from './websocket-manager';

export const sendMessageAction = (wsManager: WebsocketManager, event: WsSendMessageEvent) => {
	wsManager.send(event);

	roomMessages.update((messages) => [
		...messages,
		{
			content: event.content
		}
	]);
};
