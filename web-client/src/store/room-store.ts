import { writable } from 'svelte/store';
import { RoomStatus, type RoomMessage } from '../types/room-types';
import type { RTCClient } from '$lib/classes/rtc-client';

export const roomMessages = writable<RoomMessage[]>([]);

export const appendRoomMessage = (msg: RoomMessage) =>
	roomMessages.update((prevState) => [...prevState, msg]);

export const roomStatus = writable<RoomStatus>(RoomStatus.Lobby);

export const updateRoomStatus = (status: RoomStatus) => roomStatus.set(status);

export const roomStream = writable<MediaStream | null>(null);

export const updateRoomStream = (stream: MediaStream) => roomStream.set(stream);

export const roomClients = writable<Record<number, RTCClient>>({});

export const addRoomClient = (client: RTCClient) =>
	roomClients.update((prevState) => ({
		...prevState,
		[client.getUserId()]: client
	}));

export const roomRemoteStreams = writable<Record<number, MediaStream>>({});

export const addRemoteStream = (userId: number, stream: MediaStream) =>
	roomRemoteStreams.update((prevState) => ({
		...prevState,
		[userId]: stream
	}));

export const deleteRoomClient = (userId: number) => {
	roomClients.update((prevState) => {
		delete prevState[userId];
		return prevState;
	});

	roomRemoteStreams.update((prevState) => {
		delete prevState[userId];
		return prevState;
	});
};
