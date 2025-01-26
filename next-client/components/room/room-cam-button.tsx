"use client";

import { useRoomUserStore } from "@/store/room-user-store";
import { Button } from "@/components/ui/button";
import { Video, VideoOff } from "lucide-react";

export const RoomCamButton = () => {
  const isVideoEnabled = useRoomUserStore((state) => state.isVideoEnabled);
  const toggleVideo = useRoomUserStore((state) => state.toggleVideo);

  return (
    <Button
      variant={isVideoEnabled ? "secondary" : "destructive"}
      size="icon"
      onClick={toggleVideo}
      className="rounded-full shadow-md hover:shadow-lg transition-all duration-200 w-12 h-12 [&_svg]:size-5"
    >
      {isVideoEnabled ? <Video /> : <VideoOff />}
    </Button>
  );
};
