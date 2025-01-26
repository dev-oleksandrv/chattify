"use client";

import { useRoomUserInit, useRoomUserStore } from "@/store/room-user-store";
import { memo, useEffect, useRef } from "react";
import { RoomLobby } from "./room-lobby";
import { wsManager } from "@/lib/ws/websocket";
import environment from "@/environment";
import { RoomUserView } from "@/types/room-types";
import { RoomBroadcast } from "./room-broadcast";

interface RoomEngineProps {
  token: string;
}

export const RoomEngine = memo(({ token }: RoomEngineProps) => {
  const status = useRoomUserInit();
  const view = useRoomUserStore((state) => state.view);
  const connectedRef = useRef(false);

  useEffect(() => {
    if (!token || connectedRef.current) return;

    wsManager.connect(`${environment.wsUrl}?token=${token}`);

    connectedRef.current = true;

    return () => {
      console.log("close");
      // wsManager.close();
    };
  }, [token]);

  if (view === RoomUserView.BROADCAST) {
    return <RoomBroadcast />;
  }

  return <RoomLobby />;
});
