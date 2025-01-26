import { client_loadRoomRequest } from "@/api/client-api";
import { RTCClient } from "@/lib/classes/rtc-client";
import { Room, RoomLoadingStatus } from "@/types/room-types";
import { useEffect } from "react";
import { create } from "zustand";

export interface RoomStore {
  room: Room | null;
  status: RoomLoadingStatus;

  clients: Record<number, RTCClient>;
  streams: Record<number, MediaStream>;

  updateRoom: (room: Room) => void;
  updateStatus: (status: RoomLoadingStatus) => void;
  addClient: (id: number, client: RTCClient) => void;
  addStream: (id: number, client: MediaStream) => void;
  removeClient: (id: number) => void;
  removeStream: (id: number) => void;
}

export const useRoomStore = create<RoomStore>((set, getState) => ({
  room: null,
  status: RoomLoadingStatus.IDLE,

  clients: {},
  streams: {},

  updateRoom: (room) => set({ room }),
  updateStatus: (status) => set({ status }),
  addClient: (id: number, client: RTCClient) =>
    set({
      clients: {
        ...getState().clients,
        [id]: client,
      },
    }),
  addStream: (id: number, stream: MediaStream) =>
    set({
      streams: {
        ...getState().streams,
        [id]: stream,
      },
    }),
  removeClient: (id) => {
    const clients = getState().clients;
    if (clients[id]) {
      delete clients[id];
    }
    set({ clients });
  },
  removeStream: (id) => {
    const streams = getState().streams;
    if (streams[id]) {
      delete streams[id];
    }
    set({ streams });
  },
}));

const clearRoomStore = () =>
  useRoomStore.setState(useRoomStore.getInitialState());

export const useRoomStoreInit = (id: number) => {
  const { status, updateRoom, updateStatus } = useRoomStore();

  useEffect(() => {
    const handler = async () => {
      updateStatus(RoomLoadingStatus.LOADING);
      try {
        const result = await client_loadRoomRequest(id);
        updateRoom(result);
        updateStatus(RoomLoadingStatus.READY);
      } catch (error) {
        updateStatus(RoomLoadingStatus.FAILED);
      }
    };

    handler();

    return () => clearRoomStore();
  }, []);

  return status;
};

export const getRoomClients = () => useRoomStore.getState().clients;

export const addRoomClient = (id: number, client: RTCClient) =>
  useRoomStore.getState().addClient(id, client);

export const addRoomStream = (id: number, stream: MediaStream) =>
  useRoomStore.getState().addStream(id, stream);

export const removeRoomClient = (id: number) =>
  useRoomStore.getState().removeClient(id);

export const removeRoomStream = (id: number) =>
  useRoomStore.getState().removeStream(id);
