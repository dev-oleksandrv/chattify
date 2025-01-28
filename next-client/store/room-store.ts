import { client_loadRoomRequest } from "@/api/client-api";
import { RTCClient } from "@/lib/classes/rtc-client";
import { Room, RoomLoadingStatus, RoomUser } from "@/types/room-types";
import { useEffect } from "react";
import { create } from "zustand";

export interface RoomStore {
  room: Room | null;
  status: RoomLoadingStatus;

  clients: Record<number, RTCClient>;
  streams: Record<number, MediaStream>;
  userDetails: Record<number, RoomUser>;

  updateRoom: (room: Room) => void;
  updateStatus: (status: RoomLoadingStatus) => void;
  addClient: (id: number, client: RTCClient) => void;
  addStream: (id: number, client: MediaStream) => void;
  removeClient: (id: number) => void;
  removeStream: (id: number) => void;

  setUserDetails: (userDetails: RoomStore["userDetails"]) => void;
  addUserDetails: (user: RoomUser) => void;
  removeUserDetails: (userId: number) => void;
}

export const useRoomStore = create<RoomStore>((set, getState) => ({
  room: null,
  status: RoomLoadingStatus.IDLE,

  clients: {},
  streams: {},
  userDetails: {},

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
  setUserDetails: (userDetails) => set({ userDetails }),
  addUserDetails: (user) =>
    set({
      userDetails: {
        ...getState().userDetails,
        [user.id]: user,
      },
    }),
  removeUserDetails: (userId) => {
    const userDetails = getState().userDetails;
    if (userDetails[userId]) {
      delete userDetails[userId];
    }
    set({ userDetails });
  },
}));

export const clearRoomStore = () => {
  useRoomStore.setState(useRoomStore.getInitialState());
};

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

export const setRoomUserDetails = (users: RoomUser[]) => {
  const obj = users.reduce(
    (acc, curr) => ({
      ...acc,
      [curr.id]: curr,
    }),
    {}
  );

  useRoomStore.getState().setUserDetails(obj);
};

export const addRoomUserDetails = (user: RoomUser) =>
  useRoomStore.getState().addUserDetails(user);

export const removeRoomUserDetails = (userId: number) =>
  useRoomStore.getState().removeUserDetails(userId);
