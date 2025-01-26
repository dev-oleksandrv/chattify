"use client";

import { memo } from "react";
import { useRoomStoreInit } from "@/store/room-store";
import { RoomLoadingStatus } from "@/types/room-types";
import { RoomLoading } from "./room-loading";
import { RoomError } from "./room-error";
import { RoomEngine } from "./room-engine";

interface RoomLoaderProps {
  id: number;
  token: string;
}

export const RoomLoader = memo(({ id, token }: RoomLoaderProps) => {
  const status = useRoomStoreInit(id);

  if (status === RoomLoadingStatus.LOADING) {
    return <RoomLoading />;
  }

  if (status === RoomLoadingStatus.FAILED) {
    return <RoomError />;
  }

  if (status === RoomLoadingStatus.READY) {
    return <RoomEngine token={token} />;
  }

  return null;
});
