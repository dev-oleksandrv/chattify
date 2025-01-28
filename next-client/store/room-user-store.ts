import { disableMediaTracks, enableMediaTracks } from "@/lib/utils";
import { deviceStatusChangeAction } from "@/lib/ws/websocket-actions";
import {
  RoomConnectionStatus,
  RoomUserStatus,
  RoomUserView,
} from "@/types/room-types";
import { useEffect } from "react";
import { create } from "zustand";

interface RoomUserStore {
  status: RoomUserStatus;
  stream: MediaStream | null;
  view: RoomUserView;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  connectionStatus: RoomConnectionStatus;

  updateAudioEnabled: (newValue: boolean) => void;
  updateVideoEnabled: (newValue: boolean) => void;
  updateStatus: (status: RoomUserStatus) => void;
  updateStream: (stream: MediaStream) => void;
  updateView: (view: RoomUserView) => void;
  updateConnectionStatus: (status: RoomConnectionStatus) => void;
}

export const useRoomUserStore = create<RoomUserStore>((set) => ({
  status: RoomUserStatus.LOCAL_STREAM_LOADING,
  connectionStatus: RoomConnectionStatus.CONNECTING,
  view: RoomUserView.LOBBY,
  stream: null,

  isAudioEnabled: true,
  isVideoEnabled: true,

  updateAudioEnabled: (newValue) => set({ isAudioEnabled: newValue }),
  updateVideoEnabled: (newValue) => set({ isVideoEnabled: newValue }),
  updateStatus: (status) => set({ status }),
  updateStream: (stream) => set({ stream }),
  updateView: (view) => set({ view }),
  updateConnectionStatus: (connectionStatus) => set({ connectionStatus }),
}));

export const getRoomUserStream = () => useRoomUserStore.getState().stream;

export const clearRoomUserStore = () => {
  const state = useRoomUserStore.getState();

  if (state.stream) {
    state.stream.getTracks().forEach((track) => track.stop());
  }

  useRoomUserStore.setState(useRoomUserStore.getInitialState());
};

export const toggleRoomUserAudio = () => {
  const { updateAudioEnabled, stream, isAudioEnabled } =
    useRoomUserStore.getState();

  if (!stream) return;

  if (isAudioEnabled) {
    disableMediaTracks(stream.getAudioTracks());
  } else {
    enableMediaTracks(stream.getAudioTracks());
  }

  deviceStatusChangeAction({
    deviceType: "audio",
    enabled: !isAudioEnabled,
  });
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

  deviceStatusChangeAction({
    deviceType: "video",
    enabled: !isVideoEnabled,
  });
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

export const updateRoomUserConnectionStatus = (status: RoomConnectionStatus) =>
  useRoomUserStore.getState().updateConnectionStatus(status);
