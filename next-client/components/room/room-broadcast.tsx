"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RoomChat } from "./room-chat";
import { RoomMicButton } from "./room-mic-button";
import { RoomCamButton } from "./room-cam-button";
import { RoomVideoPreview } from "./room-video-preview";

export const RoomBroadcast = () => {
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
          <div className="flex justify-center items-center">
            <RoomVideoPreview />
          </div>
          <div className="flex justify-center items-center">
            <RoomVideoPreview />
          </div>
          <div className="flex justify-center items-center">
            <RoomVideoPreview />
          </div>
          <div className="flex justify-center items-center">
            <RoomVideoPreview />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-center gap-2">
          <div className="h-[102px] mr-4">
            <RoomVideoPreview rootClassName="h-full max-w-full w-auto" />
          </div>

          <RoomMicButton />

          <RoomCamButton />
        </div>
      </div>
      <RoomChat />
    </div>
  );
};
