import { handshakeWsRequest } from "@/api/api";
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

  const { token } = await handshakeWsRequest(parseInt(id));

  return <RoomLoader id={numericId} token={token} />;
}
