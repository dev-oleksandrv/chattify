import type {
  WsChangedDeviceStatusEvent,
  WsConnectionEstablishedEvent,
  WsJoinedBroadcastEvent,
  WsJoinedLobbyEvent,
  WsLeavedLobbyEvent,
  WsReceiveMessageEvent,
  WsRtcReceiveAnswerEvent,
  WsRtcReceiveCandidateEvent,
  WsRtcReceiveOfferEvent,
} from "./websocket-events";
import { sendAnswerAction, sendOfferAction } from "./websocket-actions";
import { appendRoomChatMessage } from "@/store/room-chat-store";
import { RoomConnectionStatus, RoomMessageType } from "@/types/room-types";
import {
  addRoomClient,
  addRoomUserDetails,
  getRoomClients,
  removeRoomClient,
  removeRoomStream,
  removeRoomUserDetails,
  setRoomUserDetails,
  useRoomStore,
} from "@/store/room-store";
import { RTCClient } from "../classes/rtc-client";
import {
  getRoomUserStream,
  updateRoomUserConnectionStatus,
} from "@/store/room-user-store";

export const receiveMessageListener = (data: WsReceiveMessageEvent) => {
  appendRoomChatMessage({
    content: data.content,
    type: RoomMessageType.USER,
    userId: data.userId,
  });
};

export const connectionEstablishedEvent = (
  data: WsConnectionEstablishedEvent
) => {
  setRoomUserDetails(data.clients);
  updateRoomUserConnectionStatus(RoomConnectionStatus.CONNECTION_ESTABLISHED);
};

export const joinedLobbyListener = (data: WsJoinedLobbyEvent) => {
  appendRoomChatMessage({
    content: `'${data.details.username}' joined lobby`,
    type: RoomMessageType.SYSTEM,
  });

  addRoomUserDetails(data.details);
};

export const leavedLobbyListener = (data: WsLeavedLobbyEvent) => {
  const details = useRoomStore.getState().userDetails;
  const target = details[data.userId];

  appendRoomChatMessage({
    content: `'${target?.username ?? "N/A"}' leaved lobby`,
    type: RoomMessageType.SYSTEM,
  });

  removeRoomClient(data.userId);
  removeRoomStream(data.userId);
  removeRoomUserDetails(data.userId);
};

export const joinedBroadcastListener = (data: WsJoinedBroadcastEvent) => {
  const handle = async () => {
    const client = new RTCClient(data.userId);
    addRoomClient(data.userId, client);

    const localStream = getRoomUserStream();
    if (!localStream) {
      return;
    }

    localStream
      .getTracks()
      .forEach((track) => client.addTrack(track, localStream));

    const offer = await client.createOffer();
    sendOfferAction({
      target: data.userId,
      sdp: offer!.sdp!,
    });
  };

  handle();
};

export const receiveOfferListener = (data: WsRtcReceiveOfferEvent) => {
  const handle = async () => {
    let client = getRoomClients()[data.sender];
    if (!client) {
      client = new RTCClient(data.sender);
      addRoomClient(data.sender, client);
    }

    await client.setRemoteDescription("offer", data.sdp);
    const localStream = getRoomUserStream();
    if (localStream) {
      localStream
        .getTracks()
        .forEach((track) => client.addTrack(track, localStream));
    }

    const asnwer = await client.createAnswer();
    sendAnswerAction({
      target: data.sender,
      sdp: asnwer!.sdp!,
    });
  };

  handle();
};

export const receiveAnswerListener = (data: WsRtcReceiveAnswerEvent) => {
  const handle = async () => {
    const client = getRoomClients()[data.sender];

    if (!client) {
      console.error("failed to receive answer");
      return;
    }

    await client.applyAnswer(data.sdp);
  };

  handle();
};

export const receiveCandidateListener = (data: WsRtcReceiveCandidateEvent) => {
  const handle = async () => {
    const client = getRoomClients()[data.sender];

    if (!client) {
      console.error("failed to receive candidate");
      return;
    }

    await client.applyCandidate(data.candidate);
  };

  handle();
};

export const deviceStatusChangedListener = (
  data: WsChangedDeviceStatusEvent
) => {
  const details = useRoomStore.getState().userDetails;

  if (!details[data.userId]) {
    return;
  }

  if (data.deviceType === "audio") {
    details[data.userId].audioEnabled = data.enabled;
  }

  if (data.deviceType === "video") {
    details[data.userId].videoEnabled = data.enabled;
  }

  setRoomUserDetails(Object.values(details));
};
