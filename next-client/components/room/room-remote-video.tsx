import { memo } from "react";
import { useRoomStore } from "@/store/room-store";
import { RoomVideo } from "./room-video";

interface RoomRemoteVideoProps {
  userId: number;
}

export const RoomRemoteVideo = memo(function RoomRemoteVideo({
  userId,
}: RoomRemoteVideoProps) {
  const { userDetails, streams } = useRoomStore();

  const details = userDetails[userId];
  const stream = streams[userId];

  if (!details || !stream) {
    return null;
  }

  return (
    <RoomVideo
      user={details}
      stream={stream}
      isVideoEnabled={details?.videoEnabled ?? true}
      isAudioEnabled={details?.audioEnabled ?? true}
      isMutedLabelShown={!details?.audioEnabled}
    />
  );
});
