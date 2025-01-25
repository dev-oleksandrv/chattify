import { appendRoomMessage, roomMessages, updateRoomStatus } from '../../store/room-store';
import { RoomMessageType, RoomStatus } from '../../types/room-types';
import { wsManager } from './websocket';
import {
	WsEventType,
	type WsBaseEvent,
	type WsRtcSendAnswerEvent,
	type WsRtcSendCandidateEvent,
	type WsRtcSendOfferEvent,
	type WsSendMessageEvent
} from './websocket-events';

type ActionEvent<T extends WsBaseEvent> = Omit<T, 'type'>;

export const sendMessageAction = (event: ActionEvent<WsSendMessageEvent>) => {
	wsManager.send({
		...event,
		type: WsEventType.SendMessage
	});

	appendRoomMessage({
		content: event.content,
		type: RoomMessageType.User
	});
};

export const joinBroadcastAction = () => {
	wsManager.send({ type: WsEventType.JoinBroadcast });

	updateRoomStatus(RoomStatus.Broadcast);
};

export const sendOfferAction = (event: ActionEvent<WsRtcSendOfferEvent>) =>
	wsManager.send({
		type: WsEventType.RtcSendOffer,
		target: event.target,
		sdp: event.sdp
	});

export const sendAnswerAction = (event: ActionEvent<WsRtcSendAnswerEvent>) =>
	wsManager.send({
		type: WsEventType.RtcSendAnswer,
		target: event.target,
		sdp: event.sdp
	});

export const sendCandidateAction = (event: ActionEvent<WsRtcSendCandidateEvent>) => {
	wsManager.send({
		type: WsEventType.RtcSendCandidate,
		target: event.target,
		candidate: event.candidate
	});
};
