import { WsEventType } from './websocket-events';
import { receiveMessageListener } from './websocket-listeners';
import { WebsocketManager } from './websocket-manager';

export const wsManager = new WebsocketManager();

wsManager.addListener(WsEventType.ReceiveMessage, receiveMessageListener);
