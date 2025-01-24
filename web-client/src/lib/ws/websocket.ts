import { WsEventType } from './websocket-events';
import {
	joinedLobbyListener,
	leavedLobbyListener,
	receiveMessageListener
} from './websocket-listeners';
import { WebsocketManager } from './websocket-manager';

export const wsManager = new WebsocketManager();

wsManager.addListener(WsEventType.ReceiveMessage, receiveMessageListener);
wsManager.addListener(WsEventType.JoinedLobby, joinedLobbyListener);
wsManager.addListener(WsEventType.LeavedLobby, leavedLobbyListener);
