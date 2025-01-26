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

export enum RoomLoadingStatus {
  IDLE,
  LOADING,
  FAILED,
  READY,
}

export enum RoomUserStatus {
  Lobby,
  Connecting,
  Broadcast,

  LOCAL_STREAM_LOADING,
  LOCAL_STREAM_FAILED,
  LOCAL_STREAM_READY,
}

export enum RoomConnectionStatus {}
