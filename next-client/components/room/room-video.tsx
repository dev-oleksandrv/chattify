import { DEFAULT_AVATAR_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { RoomUser } from "@/types/room-types";
import { CircleXIcon, LoaderCircleIcon, MicOffIcon } from "lucide-react";
import { memo, useEffect, useRef } from "react";

export interface RoomVideoProps {
  stream: MediaStream | null;

  label?: string;
  user?: RoomUser;
  isLoading?: boolean;
  isError?: boolean;
  isVideoEnabled?: boolean;
  isAudioEnabled?: boolean;
  isMutedLabelShown?: boolean;

  rootClassName?: string;
}

export const RoomVideo = memo(function RoomVideo({
  user,
  stream,
  label,
  isLoading,
  isError,
  isVideoEnabled,
  isAudioEnabled,
  isMutedLabelShown,
  rootClassName,
}: RoomVideoProps) {
  const videoEl = useRef<HTMLVideoElement | null>(null);

  const computedLabel = user?.username || label;

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
        muted={!isAudioEnabled}
        playsInline
        ref={videoEl}
      />

      {isMutedLabelShown && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 bg-red-100 border-red-500 text-red-500 rounded-full flex gap-2 items-center z-30">
          <MicOffIcon className="size-4" />
          <p className="text-sm">Muted</p>
        </div>
      )}

      {computedLabel && (
        <div className="absolute top-2 left-2 px-4 py-1 shadow bg-white rounded-full flex items-center z-30">
          <p className="text-sm">{computedLabel}</p>
        </div>
      )}

      {!isVideoEnabled && (
        <div className="flex-1 w-full h-full bg-slate-600 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <img
              src={user?.avatarUrl || DEFAULT_AVATAR_URL}
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
