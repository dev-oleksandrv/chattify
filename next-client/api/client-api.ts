import environment from "@/environment";
import axios from "axios";
import { getCookie } from "@/lib/utils";
import { Room } from "@/types/room-types";

const apiClient = axios.create({
  baseURL: environment.apiUrl,
});

apiClient.interceptors.request.use(async (cfg) => {
  const token = getCookie("auth_token");
  if (token) {
    cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
});

export const client_loadRoomRequest = async (id: number) =>
  apiClient
    .get<Room>(`/api/protected/room/${id}`)
    .then((response) => response.data);
