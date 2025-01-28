import { clearRoomChatStore } from "./room-chat-store";
import { clearRoomStore } from "./room-store";
import { clearRoomUserStore } from "./room-user-store";

export const resetRoomStore = () => {
  clearRoomStore();
  clearRoomChatStore();
  clearRoomUserStore();
};
