import { disableMediaTracks, enableMediaTracks } from "@/lib/utils";
import { RoomUserStatus, RoomUserView } from "@/types/room-types";
import { useEffect } from "react";
import { create } from "zustand";

interface RoomUserStore {
  status: RoomUserStatus;
  stream: MediaStream | null;
  view: RoomUserView;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;

  updateAudioEnabled: (newValue: boolean) => void;
  updateVideoEnabled: (newValue: boolean) => void;
  updateStatus: (status: RoomUserStatus) => void;
  updateStream: (stream: MediaStream) => void;
  updateView: (view: RoomUserView) => void;
}

export const useRoomUserStore = create<RoomUserStore>((set) => ({
  status: RoomUserStatus.LOCAL_STREAM_LOADING,
  view: RoomUserView.LOBBY,
  stream: null,

  isAudioEnabled: true,
  isVideoEnabled: true,

  updateAudioEnabled: (newValue) => set({ isAudioEnabled: newValue }),
  updateVideoEnabled: (newValue) => set({ isVideoEnabled: newValue }),
  updateStatus: (status) => set({ status }),
  updateStream: (stream) => set({ stream }),
  updateView: (view) => set({ view }),
}));

export const getRoomUserStream = () => useRoomUserStore.getState().stream;

export const clearRoomUserStore = () =>
  useRoomUserStore.setState(useRoomUserStore.getInitialState());

export const toggleRoomUserAudio = () => {
  const { updateAudioEnabled, stream, isAudioEnabled } =
    useRoomUserStore.getState();

  if (!stream) return;

  if (isAudioEnabled) {
    disableMediaTracks(stream.getAudioTracks());
  } else {
    enableMediaTracks(stream.getAudioTracks());
  }

  updateAudioEnabled(!isAudioEnabled);
};

export const toggleRoomUserVideo = () => {
  const { updateVideoEnabled, stream, isVideoEnabled } =
    useRoomUserStore.getState();

  if (!stream) return;

  if (isVideoEnabled) {
    disableMediaTracks(stream.getVideoTracks());
  } else {
    enableMediaTracks(stream.getVideoTracks());
  }

  updateVideoEnabled(!isVideoEnabled);
};

export const useRoomUserInit = () => {
  const { status, updateStream, updateStatus } = useRoomUserStore();

  useEffect(() => {
    const handler = async () => {
      updateStatus(RoomUserStatus.LOCAL_STREAM_LOADING);

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        updateStream(stream);
        updateStatus(RoomUserStatus.LOCAL_STREAM_READY);
      } catch (error) {
        console.error(error);

        updateStatus(RoomUserStatus.LOCAL_STREAM_FAILED);
      }
    };

    handler();

    return () => clearRoomUserStore();
  }, []);

  return status;
};

export const updateRoomUserView = (view: RoomUserView) =>
  useRoomUserStore.getState().updateView(view);
