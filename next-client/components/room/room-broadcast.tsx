"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RoomChat } from "./room-chat";
import { RoomMicButton } from "./room-mic-button";
import { RoomCamButton } from "./room-cam-button";
import { RoomVideoPreview } from "./room-video-preview";
import { useRoomUserStore } from "@/store/room-user-store";
import { useRoomStore } from "@/store/room-store";

export const RoomBroadcast = () => {
  const { stream, isVideoEnabled } = useRoomUserStore();
  const streams = useRoomStore((state) => state.streams);

  console.log(streams);

  return (
    <div className="flex md:flex-row h-[calc(100vh-7rem)] gap-4">
      <div className="flex flex-col flex-1">
        <div className="mb-2">
          <Button
            variant="ghost"
            asChild
            size="sm"
            className="text-gray-600 hover:text-gray-800"
          >
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Rooms
            </Link>
          </Button>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-2 overflow-auto">
          {Object.entries(streams).map(([id, stream]) => (
            <div key={id} className="flex justify-center items-center">
              <RoomVideoPreview stream={stream} />
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-center gap-2">
          <div className="h-[102px] mr-4">
            <RoomVideoPreview
              isVideoEnabled={isVideoEnabled}
              stream={stream}
              rootClassName="h-full max-w-full w-auto"
            />
          </div>

          <RoomMicButton />

          <RoomCamButton />
        </div>
      </div>
      <RoomChat />
    </div>
  );
};
