"use client";

import { cn } from "@/lib/utils";
import { faker } from "@faker-js/faker";
import { CircleXIcon, LoaderCircleIcon } from "lucide-react";
import { memo, useEffect, useRef } from "react";

interface RoomVideoPreviewProps {
  stream?: MediaStream | null;

  isLoading?: boolean;
  isError?: boolean;
  isVideoEnabled?: boolean;
  rootClassName?: string;
}

export const RoomVideoPreview = memo(function RoomVideoPreview({
  stream,
  isLoading = false,
  isError = false,
  isVideoEnabled = true,
  rootClassName,
}: RoomVideoPreviewProps) {
  const videoEl = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (stream && videoEl.current) {
      videoEl.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div
      className={cn(
        "relative max-w-full h-full max-h-full aspect-video bg-gray-300 rounded-lg flex items-center justify-center overflow-hidden",
        rootClassName
      )}
    >
      <video
        className={cn("w-full h-full object-cover rounded-lg", {
          hidden: !isVideoEnabled,
        })}
        autoPlay
        muted
        playsInline
        ref={videoEl}
      />

      {!isVideoEnabled && (
        <div className="flex-1 w-full h-full bg-slate-600 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <img
              src={faker.image.avatar()}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {isLoading && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
          <LoaderCircleIcon className="size-16 text-indigo-500 animate-spin" />
        </div>
      )}

      {isError && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
          <CircleXIcon className="size-16 text-red-400" />
        </div>
      )}
    </div>
  );
});
