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

export enum RoomUserStatus {
  Lobby,
  Connecting,
  Broadcast,
}
