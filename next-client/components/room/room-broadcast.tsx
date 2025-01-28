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
import { RoomRemoteVideo } from "./room-remote-video";
import { RoomGrid } from "./room-grid";

export const RoomBroadcast = () => {
  const streams = useRoomStore((state) => state.streams);

  const streamKeys = Object.keys(streams);

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
        {!streamKeys.length && (
          <div className="flex-1 flex justify-center items-center">
            <p>No users in video room</p>
          </div>
        )}
        {streamKeys.length > 0 && (
          <RoomGrid count={streamKeys.length}>
            {streamKeys.map((id) => (
              <div key={id} className="flex justify-center items-center">
                <RoomRemoteVideo userId={+id} />
              </div>
            ))}
          </RoomGrid>
        )}
        <div className="mt-4 flex items-center justify-center gap-2">
          <div className="h-[102px] mr-4">
            <RoomVideoPreview
              rootClassName="h-full max-w-full w-auto"
              isLabelShown
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
