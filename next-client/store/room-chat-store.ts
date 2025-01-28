import { RoomMessage } from "@/types/room-types";
import { create } from "zustand";

export interface RoomChatStore {
  messages: RoomMessage[];

  append: (message: RoomMessage) => void;
  clear: () => void;
}

export const useRoomChatStore = create<RoomChatStore>((set, getState) => ({
  messages: [],

  append: (message) => set({ messages: [...getState().messages, message] }),
  clear: () => set({ messages: [] }),
}));

export const clearRoomChatStore = () =>
  useRoomChatStore.setState(useRoomChatStore.getInitialState());

export const appendRoomChatMessage = (message: RoomMessage) =>
  useRoomChatStore.getState().append(message);
