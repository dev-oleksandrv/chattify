import { User } from "@/types/user-types";

export interface LoginUserResponse {
  user: User;
  token: string;
}

export interface RegisterUserResponse extends LoginUserResponse {}
