import { client_loadRoomRequest } from "@/api/client-api";
import { Room, RoomLoadingStatus } from "@/types/room-types";
import { useEffect } from "react";
import { create } from "zustand";

export interface RoomStore {
  room: Room | null;
  status: RoomLoadingStatus;

  updateRoom: (room: Room) => void;
  updateStatus: (status: RoomLoadingStatus) => void;
}

export const useRoomStore = create<RoomStore>((set, getState) => ({
  room: null,
  status: RoomLoadingStatus.IDLE,

  updateRoom: (room) => set({ room }),
  updateStatus: (status) => set({ status }),
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
