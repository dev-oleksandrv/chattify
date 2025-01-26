"use client";

import { toggleRoomUserVideo, useRoomUserStore } from "@/store/room-user-store";
import { Button } from "@/components/ui/button";
import { Video, VideoOff } from "lucide-react";
import { RoomUserStatus } from "@/types/room-types";
import { memo } from "react";

export const RoomCamButton = memo(() => {
  const status = useRoomUserStore((state) => state.status);
  const isVideoEnabled = useRoomUserStore((state) => state.isVideoEnabled);

  return (
    <Button
      variant={isVideoEnabled ? "secondary" : "destructive"}
      size="icon"
      onClick={toggleRoomUserVideo}
      className="rounded-full shadow-md hover:shadow-lg transition-all duration-200 w-12 h-12 [&_svg]:size-5"
      disabled={status !== RoomUserStatus.LOCAL_STREAM_READY}
    >
      {isVideoEnabled ? <Video /> : <VideoOff />}
    </Button>
  );
});
