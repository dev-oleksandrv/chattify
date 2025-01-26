"use client";

import { RoomEngine } from "@/components/room/room-engine";
import { RoomError } from "@/components/room/room-error";
import { RoomLoading } from "@/components/room/room-loading";
import { useRoomStoreInit } from "@/store/room-store";
import { RoomLoadingStatus } from "@/types/room-types";
import { useParams } from "next/navigation";

export default function RoomPage() {
  const { id } = useParams<{ id: string }>();

  const status = useRoomStoreInit(parseInt(id));

  if (status === RoomLoadingStatus.LOADING) {
    return <RoomLoading />;
  }

  if (status === RoomLoadingStatus.FAILED) {
    return <RoomError />;
  }

  if (status === RoomLoadingStatus.READY) {
    return <RoomEngine />;
  }

  return null;
}
