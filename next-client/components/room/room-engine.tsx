"use client";

import { useRoomUserInit } from "@/store/room-user-store";
import { memo } from "react";
import { RoomLobby } from "./room-lobby";

export const RoomEngine = memo(() => {
  useRoomUserInit();

  return <RoomLobby />;
});
