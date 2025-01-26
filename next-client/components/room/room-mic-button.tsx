"use client";

import { toggleRoomUserAudio, useRoomUserStore } from "@/store/room-user-store";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { RoomUserStatus } from "@/types/room-types";
import { memo } from "react";

export const RoomMicButton = memo(function RoomMicButton() {
  const status = useRoomUserStore((state) => state.status);
  const isAudioEnabled = useRoomUserStore((state) => state.isAudioEnabled);

  return (
    <Button
      variant={isAudioEnabled ? "secondary" : "destructive"}
      size="icon"
      onClick={toggleRoomUserAudio}
      className="rounded-full shadow-md hover:shadow-lg transition-all duration-200 w-12 h-12 [&_svg]:size-5"
      disabled={status !== RoomUserStatus.LOCAL_STREAM_READY}
    >
      {isAudioEnabled ? <Mic /> : <MicOff />}
    </Button>
  );
});
