"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { memo, useState } from "react";
import { RoomChatMessage } from "./room-chat-message";

export const RoomChat = memo(() => {
  const [message, setMessage] = useState("");

  return (
    <Card className="w-full md:w-96">
      <CardContent className="p-4 flex flex-col h-full">
        <h2 className="text-sm font-semibold mb-4 text-gray-800">Chat</h2>
        <ScrollArea className="flex-1 mb-4 pr-4">
          {[...Array(10)].map((_, i) => (
            <RoomChatMessage key={i} />
          ))}
        </ScrollArea>
        <div className="flex flex-col space-y-1">
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <p className="text-xs text-gray-400">
            Press &apos;Enter&apos; to send a message
          </p>
        </div>
      </CardContent>
    </Card>
  );
});
