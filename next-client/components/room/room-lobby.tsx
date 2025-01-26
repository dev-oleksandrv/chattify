"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { RoomChat } from "./room-chat";
import { RoomMicButton } from "./room-mic-button";
import { RoomCamButton } from "./room-cam-button";
import { RoomVideoPreview } from "./room-video-preview";
import { useRoomUserStore } from "@/store/room-user-store";
import { RoomUserStatus } from "@/types/room-types";

export const RoomLobby = () => {
  const status = useRoomUserStore((state) => state.status);
  const updateStatus = useRoomUserStore((state) => state.updateStatus);

  const joinBroadcastHandler = () => {
    updateStatus(RoomUserStatus.Connecting);

    setTimeout(() => {
      updateStatus(RoomUserStatus.Broadcast);
    }, 3000);
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-7rem)] gap-4">
      <div className="flex-1 flex flex-col">
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
        <Card className="flex-1 mb-6">
          <CardContent className="p-6 flex flex-col items-center justify-center h-full">
            <RoomVideoPreview rootClassName="" />
            <div className="flex justify-center space-x-4 mt-4">
              <RoomMicButton />
              <RoomCamButton />
            </div>
          </CardContent>
        </Card>
        <Button
          size="lg"
          className="bg-indigo-600 hover:bg-indigo-700"
          disabled={status === RoomUserStatus.Connecting}
          onClick={joinBroadcastHandler}
        >
          Join Video Room
        </Button>
      </div>
      <RoomChat />
    </div>
  );
};
