import type {
  WsJoinedBroadcastEvent,
  WsJoinedLobbyEvent,
  WsReceiveMessageEvent,
  WsRtcReceiveAnswerEvent,
  WsRtcReceiveCandidateEvent,
  WsRtcReceiveOfferEvent,
} from "./websocket-events";
import { sendAnswerAction, sendOfferAction } from "./websocket-actions";
import { appendRoomChatMessage } from "@/store/room-chat-store";
import { RoomMessageType } from "@/types/room-types";
import {
  addRoomClient,
  getRoomClients,
  removeRoomClient,
} from "@/store/room-store";
import { RTCClient } from "../classes/rtc-client";
import { getRoomUserStream } from "@/store/room-user-store";

export const receiveMessageListener = (data: WsReceiveMessageEvent) => {
  appendRoomChatMessage({
    content: data.content,
    type: RoomMessageType.USER,
  });
};

export const joinedLobbyListener = (data: WsJoinedLobbyEvent) => {
  appendRoomChatMessage({
    content: `User ${data.userId} joined lobby`,
    type: RoomMessageType.SYSTEM,
  });
};

export const leavedLobbyListener = (data: WsJoinedLobbyEvent) => {
  appendRoomChatMessage({
    content: `User ${data.userId} leaved lobby`,
    type: RoomMessageType.SYSTEM,
  });

  removeRoomClient(data.userId);
};

export const joinedBroadcastListener = (data: WsJoinedBroadcastEvent) => {
  const handle = async () => {
    console.log("joined broadcast", data);
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
