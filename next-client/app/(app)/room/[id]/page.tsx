"use client";

import { RoomBroadcast } from "@/components/room/room-broadcast";
import { RoomLobby } from "@/components/room/room-lobby";
import { useRoomUserStore } from "@/store/room-user-store";
import { RoomUserStatus } from "@/types/room-types";

export default function RoomPage() {
  const status = useRoomUserStore((state) => state.status);

  if (status === RoomUserStatus.Broadcast) {
    return <RoomBroadcast />;
  }

  return <RoomLobby />;
}
