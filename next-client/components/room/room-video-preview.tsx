"use client";

import { cn } from "@/lib/utils";
import { useRoomUserStore } from "@/store/room-user-store";
import { faker } from "@faker-js/faker";

interface RoomVideoPreviewProps {
  rootClassName?: string;
}

export const RoomVideoPreview = ({ rootClassName }: RoomVideoPreviewProps) => {
  const isVideoEnabled = useRoomUserStore((state) => state.isVideoEnabled);

  return (
    <div
      className={cn(
        "max-w-full h-full max-h-full aspect-video bg-gray-400 rounded-lg flex items-center justify-center overflow-hidden",
        rootClassName
      )}
    >
      {isVideoEnabled ? (
        <video
          className="w-full h-full object-cover rounded-lg"
          autoPlay
          muted
          playsInline
        />
      ) : (
        <div className="flex-1 w-full h-full bg-slate-600 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <img
              src={faker.image.avatar()}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
};
