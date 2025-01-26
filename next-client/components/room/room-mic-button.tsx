"use client";

import { useRoomUserStore } from "@/store/room-user-store";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";

export const RoomMicButton = () => {
  const isAudioEnabled = useRoomUserStore((state) => state.isAudioEnabled);
  const toggleAudio = useRoomUserStore((state) => state.toggleAudio);

  return (
    <Button
      variant={isAudioEnabled ? "secondary" : "destructive"}
      size="icon"
      onClick={toggleAudio}
      className="rounded-full shadow-md hover:shadow-lg transition-all duration-200 w-12 h-12 [&_svg]:size-5"
    >
      {isAudioEnabled ? <Mic /> : <MicOff />}
    </Button>
  );
};
