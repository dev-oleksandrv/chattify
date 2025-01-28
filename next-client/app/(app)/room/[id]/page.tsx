import { handshakeWsRequest } from "@/api/api";
import { RoomError } from "@/components/room/room-error";
import { RoomLoader } from "@/components/room/room-loader";

export default async function RoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = parseInt(id);

  if (Number.isNaN(numericId)) {
    return null;
  }

  let token: string = "";

  try {
    const result = await handshakeWsRequest(parseInt(id));
    token = result.token;
  } catch {
    return <RoomError />;
  }

  return <RoomLoader id={numericId} token={token} />;
}
