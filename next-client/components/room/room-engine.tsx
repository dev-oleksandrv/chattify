"use client";

import { useRoomUserInit, useRoomUserStore } from "@/store/room-user-store";
import { memo, useEffect, useRef } from "react";
import { RoomLobby } from "./room-lobby";
import { wsManager } from "@/lib/ws/websocket";
import environment from "@/environment";
import { RoomUserView } from "@/types/room-types";
import { RoomBroadcast } from "./room-broadcast";
import { resetRoomStore } from "@/store/helpers";

interface RoomEngineProps {
  token: string;
}

export const RoomEngine = memo(function RoomEngine({ token }: RoomEngineProps) {
  const view = useRoomUserStore((state) => state.view);

  useEffect(() => {
    if (!token) return;

    wsManager.connect(`${environment.wsUrl}?token=${token}`);

    return () => {
      wsManager.close();
      resetRoomStore();
    };
  }, [token]);

  useRoomUserInit();

  if (view === RoomUserView.BROADCAST) {
    return <RoomBroadcast />;
  }

  return <RoomLobby />;
});
