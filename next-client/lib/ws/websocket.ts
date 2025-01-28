import { WsEventType } from "./websocket-events";
import {
  connectionEstablishedEvent,
  deviceStatusChangedListener,
  joinedBroadcastListener,
  joinedLobbyListener,
  leavedLobbyListener,
  receiveAnswerListener,
  receiveCandidateListener,
  receiveMessageListener,
  receiveOfferListener,
} from "./websocket-listeners";
import { WebsocketManager } from "./websocket-manager";

export const wsManager = new WebsocketManager();

wsManager.addListener(WsEventType.ReceiveMessage, receiveMessageListener);
wsManager.addListener(WsEventType.JoinedLobby, joinedLobbyListener);
wsManager.addListener(WsEventType.LeavedLobby, leavedLobbyListener);
wsManager.addListener(WsEventType.JoinedBroadcast, joinedBroadcastListener);
wsManager.addListener(WsEventType.RtcReceiveOffer, receiveOfferListener);
wsManager.addListener(WsEventType.RtcReceiveAnswer, receiveAnswerListener);
wsManager.addListener(
  WsEventType.RtcReceiveCandidate,
  receiveCandidateListener
);
wsManager.addListener(
  WsEventType.ConnectionEstablished,
  connectionEstablishedEvent
);
wsManager.addListener(
  WsEventType.ChangedDeviceStatus,
  deviceStatusChangedListener
);
