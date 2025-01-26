"use server";

import environment from "@/environment";
import {
  LoginUserSchemaType,
  RegisterUserSchemaType,
} from "@/schemas/auth-schemas";
import axios from "axios";
import { cookies } from "next/headers";
import { LoginUserResponse, RegisterUserResponse } from "./response";
import { User } from "@/types/user-types";

const apiClient = axios.create({
  baseURL: environment.apiUrl,
});

apiClient.interceptors.request.use(async (cfg) => {
  const token = (await cookies()).get("auth_token");
  if (token) {
    cfg.headers.Authorization = `Bearer ${token.value}`;
  }
  return cfg;
});

export const verifyUserRequest = async () =>
  apiClient.get<User>("/api/auth/verify").then((response) => response.data);

export const loginUserRequest = async (dto: LoginUserSchemaType) =>
  apiClient
    .post<LoginUserResponse>("/api/auth/login", dto)
    .then((response) => response.data);

export const registerUserRequest = async (dto: RegisterUserSchemaType) =>
  apiClient
    .post<RegisterUserResponse>("/api/auth/register", dto)
    .then((response) => response.data);

export const handshakeWsRequest = async (id: number) =>
  apiClient
    .get<{ token: string }>("/api/protected/ws/handshake", {
      headers: {
        "X-Room-Id": id,
      },
    })
    .then((response) => response.data);
