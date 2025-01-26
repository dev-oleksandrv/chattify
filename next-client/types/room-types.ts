export interface RoomUser {
  id: number;
  username: string;
  avatarUrl: string;
}

export interface Room {
  id: number;
  title: string;
  onlineUsers: RoomUser[];
}

export interface RoomMessage {
  content: string;
  type: RoomMessageType;
}

export enum RoomLoadingStatus {
  IDLE,
  LOADING,
  FAILED,
  READY,
}

export enum RoomUserStatus {
  LOCAL_STREAM_LOADING,
  LOCAL_STREAM_FAILED,
  LOCAL_STREAM_READY,
}

export enum RoomUserView {
  LOBBY,
  BROADCAST,
}

export enum RoomMessageType {
  USER,
  SYSTEM,
}

export enum RoomConnectionStatus {}
