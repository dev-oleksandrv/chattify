import { RTCClient } from '$lib/classes/rtc-client';
import { get } from 'svelte/store';
import {
	addRoomClient,
	appendRoomMessage,
	deleteRoomClient,
	roomClients,
	roomStream
} from '../../store/room-store';
import { RoomMessageType } from '../../types/room-types';
import type {
	WsJoinedBroadcastEvent,
	WsJoinedLobbyEvent,
	WsReceiveMessageEvent,
	WsRtcReceiveAnswerEvent,
	WsRtcReceiveCandidateEvent,
	WsRtcReceiveOfferEvent
} from './websocket-events';
import { sendAnswerAction, sendOfferAction } from './websocket-actions';

export const receiveMessageListener = (data: WsReceiveMessageEvent) => {
	appendRoomMessage({
		content: data.content,
		type: RoomMessageType.User
	});
};

export const joinedLobbyListener = (data: WsJoinedLobbyEvent) => {
	appendRoomMessage({
		content: `User ${data.userId} joined lobby`,
		type: RoomMessageType.System
	});
};

export const leavedLobbyListener = (data: WsJoinedLobbyEvent) => {
	appendRoomMessage({
		content: `User ${data.userId} leaved lobby`,
		type: RoomMessageType.System
	});

	deleteRoomClient(data.userId);
};

export const joinedBroadcastListener = (data: WsJoinedBroadcastEvent) => {
	const handle = async () => {
		console.log('joined broadcast', data);
		const client = new RTCClient(data.userId);
		addRoomClient(client);

		const localStream = get(roomStream);
		if (!localStream) {
			return;
		}

		localStream.getTracks().forEach((track) => client.addTrack(track, localStream));

		const offer = await client.createOffer();
		sendOfferAction({
			target: data.userId,
			sdp: offer!.sdp!
		});
	};

	handle();
};

export const receiveOfferListener = (data: WsRtcReceiveOfferEvent) => {
	const handle = async () => {
		let client = get(roomClients)[data.sender];
		if (!client) {
			client = new RTCClient(data.sender);
			addRoomClient(client);
		}
		addRoomClient(client);

		await client.setRemoteDescription('offer', data.sdp);
		const localStream = get(roomStream);
		if (localStream) {
			localStream.getTracks().forEach((track) => client.addTrack(track, localStream));
		}

		const asnwer = await client.createAnswer();
		sendAnswerAction({
			target: data.sender,
			sdp: asnwer!.sdp!
		});
	};

	handle();
};

export const receiveAnswerListener = (data: WsRtcReceiveAnswerEvent) => {
	const handle = async () => {
		const client = get(roomClients)[data.sender];

		if (!client) {
			console.error('failed to receive answer');
			return;
		}

		await client.applyAnswer(data.sdp);
	};

	handle();
};

export const receiveCandidateListener = (data: WsRtcReceiveCandidateEvent) => {
	const handle = async () => {
		const client = get(roomClients)[data.sender];

		if (!client) {
			console.error('failed to receive candidate');
			return;
		}

		await client.applyCandidate(data.candidate);
	};

	handle();
};
