import { appendRoomChatMessage } from "@/store/room-chat-store";
import { wsManager } from "./websocket";
import {
  WsEventType,
  type WsBaseEvent,
  type WsRtcSendAnswerEvent,
  type WsRtcSendCandidateEvent,
  type WsRtcSendOfferEvent,
  type WsSendMessageEvent,
} from "./websocket-events";
import { RoomMessageType, RoomUserView } from "@/types/room-types";
import { updateRoomUserView } from "@/store/room-user-store";

type ActionEvent<T extends WsBaseEvent> = Omit<T, "type">;

export const sendMessageAction = (event: ActionEvent<WsSendMessageEvent>) => {
  wsManager.send({
    ...event,
    type: WsEventType.SendMessage,
  });

  appendRoomChatMessage({
    content: event.content,
    type: RoomMessageType.USER,
  });
};

export const joinBroadcastAction = () => {
  wsManager.send({ type: WsEventType.JoinBroadcast });

  updateRoomUserView(RoomUserView.BROADCAST);
};

export const sendOfferAction = (event: ActionEvent<WsRtcSendOfferEvent>) =>
  wsManager.send({
    type: WsEventType.RtcSendOffer,
    target: event.target,
    sdp: event.sdp,
  });

export const sendAnswerAction = (event: ActionEvent<WsRtcSendAnswerEvent>) =>
  wsManager.send({
    type: WsEventType.RtcSendAnswer,
    target: event.target,
    sdp: event.sdp,
  });

export const sendCandidateAction = (
  event: ActionEvent<WsRtcSendCandidateEvent>
) => {
  wsManager.send({
    type: WsEventType.RtcSendCandidate,
    target: event.target,
    candidate: event.candidate,
  });
};
