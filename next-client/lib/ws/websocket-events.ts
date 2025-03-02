import { RoomUser } from "@/types/room-types";

export interface WsReceiveMessageEvent extends WsBaseEvent {
  type: WsEventType.ReceiveMessage;
  content: string;
  userId: number;
}

export interface WsSendMessageEvent extends WsBaseEvent {
  type: WsEventType.SendMessage;
  content: string;
}

export interface WsJoinedLobbyEvent extends WsBaseEvent {
  type: WsEventType.SendMessage;
  details: RoomUser;
}

export interface WsLeavedLobbyEvent extends WsBaseEvent {
  type: WsEventType.LeavedLobby;
  userId: number;
}

export interface WsJoinBroadcastEvent extends WsBaseEvent {
  type: WsEventType.JoinBroadcast;
}

export interface WsJoinedBroadcastEvent extends WsBaseEvent {
  type: WsEventType.JoinedBroadcast;
  userId: number;
}

export interface WsRtcSendOfferEvent extends WsBaseEvent {
  type: WsEventType.RtcSendOffer;
  target: number;
  sdp: string;
}

export interface WsRtcSendAnswerEvent extends WsBaseEvent {
  type: WsEventType.RtcSendAnswer;
  target: number;
  sdp: string;
}

export interface WsRtcSendCandidateEvent extends WsBaseEvent {
  type: WsEventType.RtcSendCandidate;
  target: number;
  candidate: string;
}

export interface WsRtcReceiveOfferEvent extends WsBaseEvent {
  type: WsEventType.RtcReceiveOffer;
  target: number;
  sender: number;
  sdp: string;
}

export interface WsRtcReceiveAnswerEvent extends WsBaseEvent {
  type: WsEventType.RtcReceiveAnswer;
  target: number;
  sender: number;
  sdp: string;
}

export interface WsRtcReceiveCandidateEvent extends WsBaseEvent {
  type: WsEventType.RtcReceiveCandidate;
  target: number;
  sender: number;
  candidate: string;
}

export interface WsConnectionEstablishedEvent extends WsBaseEvent {
  type: WsEventType.ConnectionEstablished;
  clients: RoomUser[];
}

export interface WsDeviceStatusChangeEvent extends WsBaseEvent {
  type: WsEventType.DeviceStatusChange;
  deviceType: "audio" | "video";
  enabled: boolean;
}

export interface WsChangedDeviceStatusEvent extends WsBaseEvent {
  type: WsEventType.ChangedDeviceStatus;
  deviceType: "audio" | "video";
  enabled: boolean;
  userId: number;
}

export interface WsBaseEvent {
  type: WsEventType;
}

export enum WsEventType {
  ReceiveMessage = "receive_message",
  SendMessage = "send_message",

  JoinedLobby = "joined_lobby",
  LeavedLobby = "leaved_lobby",
  JoinBroadcast = "join_broadcast",
  JoinedBroadcast = "joined_broadcast",

  RtcSendOffer = "rtc_send_offer",
  RtcReceiveOffer = "rtc_receive_offer",
  RtcSendAnswer = "rtc_send_answer",
  RtcReceiveAnswer = "rtc_receive_answer",
  RtcSendCandidate = "rtc_send_candidate",
  RtcReceiveCandidate = "rtc_receive_candidate",

  ConnectionEstablished = "connection_established",
  DeviceStatusChange = "device_status_change",
  ChangedDeviceStatus = "changed_device_status",
}
