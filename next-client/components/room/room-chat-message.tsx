import { DEFAULT_AVATAR_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useRoomStore } from "@/store/room-store";
import { RoomMessage, RoomMessageType } from "@/types/room-types";
import { faker } from "@faker-js/faker";
import { memo, useMemo } from "react";

interface RoomChatMessageProps {
  message: RoomMessage;
}

export const RoomChatMessage = memo(function RoomChatMessage({
  message,
}: RoomChatMessageProps) {
  if (message.type === RoomMessageType.SYSTEM) {
    return <p className="italic text-sm text-gray-500">{message.content}</p>;
  }

  return <RoomChatMessageUser message={message} />;
});

const RoomChatMessageUser = memo(function RoomChatMessageUser({
  message,
}: RoomChatMessageProps) {
  const details = useRoomStore((state) => state.userDetails);

  const user = useMemo(() => {
    if (!message.userId || !details[message.userId]) {
      return null;
    }

    return details[message.userId];
  }, [details, message.userId]);

  return (
    <div className="flex gap-2 mt-2">
      {!!user && (
        <div className="flex flex-col justify-end items-center w-5 flex-none pb-1">
          <div className="size-5 rounded-full overflow-hidden">
            <img
              src={user.avatarUrl || DEFAULT_AVATAR_URL}
              alt={user.username}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      <div
        className={cn("bg-gray-100 space-y-1 p-2 rounded-xl flex-1", {
          "bg-indigo-200": !user,
        })}
      >
        <p className="text-indigo-500 text-xs font-medium">
          {user?.username || "You"}
        </p>
        <p className="text-sm">{message.content}</p>
      </div>
    </div>
  );
});
