"use client";

import { memo } from "react";
import { RoomVideo } from "./room-video";
import { useRoomUserStore } from "@/store/room-user-store";

export interface RoomVideoPreviewProps {
  isError?: boolean;
  isLoading?: boolean;
  isLabelShown?: boolean;
  rootClassName?: string;
}

export const RoomVideoPreview = memo(function RoomVideoPreview({
  isLoading = false,
  isError = false,
  isLabelShown = false,
  rootClassName,
}: RoomVideoPreviewProps) {
  const stream = useRoomUserStore((state) => state.stream);
  const isVideoEnabled = useRoomUserStore((state) => state.isVideoEnabled);
  const isAudioEnabled = useRoomUserStore((state) => state.isAudioEnabled);

  return (
    <RoomVideo
      stream={stream}
      isVideoEnabled={isVideoEnabled}
      isAudioEnabled={false}
      isMutedLabelShown={!isAudioEnabled}
      isLoading={isLoading}
      isError={isError}
      label={isLabelShown ? "You" : ""}
      rootClassName={rootClassName}
    />
  );
});
