import { RoomUserStatus } from "@/types/room-types";
import { create } from "zustand";

interface RoomUserStore {
  status: RoomUserStatus;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;

  updateStatus: (status: RoomUserStatus) => void;
  toggleAudio: () => void;
  toggleVideo: () => void;
}

export const useRoomUserStore = create<RoomUserStore>((set, getState) => ({
  status: RoomUserStatus.Lobby,
  isAudioEnabled: true,
  isVideoEnabled: true,

  updateStatus: (status) => set({ status }),
  toggleAudio: () => set({ isAudioEnabled: !getState().isAudioEnabled }),
  toggleVideo: () => set({ isVideoEnabled: !getState().isVideoEnabled }),
}));
