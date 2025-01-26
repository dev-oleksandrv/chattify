"use client";

import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { FormEvent, memo, useEffect, useRef, useState } from "react";
import { RoomChatMessage } from "./room-chat-message";
import { useRoomChatStore } from "@/store/room-chat-store";
import { sendMessageAction } from "@/lib/ws/websocket-actions";

export const RoomChat = memo(() => {
  const messages = useRoomChatStore((state) => state.messages);
  const prevMessagesCount = useRef(messages.length);
  const chatScrolled = useRef(false);
  const scrollContainerEl = useRef<HTMLDivElement>(null);

  const [message, setMessage] = useState("");

  const submitHandler = (event: FormEvent) => {
    event.preventDefault();

    const normalizedMessage = message.trim();
    if (!normalizedMessage.length) {
      return;
    }

    sendMessageAction({
      content: normalizedMessage,
    });

    setMessage("");
  };

  useEffect(() => {
    if (!scrollContainerEl.current) return;

    const handler = () => {
      if (!scrollContainerEl.current) return;

      const elementBottom = scrollContainerEl.current.scrollHeight;
      const scrollPosition =
        scrollContainerEl.current.scrollTop +
        scrollContainerEl.current.clientHeight;
      const pxToBottom = elementBottom - scrollPosition;

      if (pxToBottom >= 10 && !chatScrolled.current) {
        chatScrolled.current = true;
        return;
      }

      if (pxToBottom < 10 && chatScrolled.current) {
        chatScrolled.current = false;
      }
    };

    scrollContainerEl.current.addEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (
      !scrollContainerEl.current ||
      messages.length <= prevMessagesCount.current
    )
      return;

    prevMessagesCount.current = messages.length;

    if (!chatScrolled.current) {
      scrollContainerEl.current.scrollTo({
        top: scrollContainerEl.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <Card className="w-full md:w-96">
      <CardContent className="p-4 flex flex-col h-full space-y-2">
        <h2 className="text-sm font-semibold text-gray-800">Chat</h2>
        <div className="flex-1 overflow-auto" ref={scrollContainerEl}>
          {messages.map((message, i) => (
            // TODO: make normal keys o_O
            <RoomChatMessage
              key={`_${message.content}_${i}`}
              message={message}
            />
          ))}
        </div>
        <div className="flex flex-none flex-col space-y-1">
          <form onSubmit={submitHandler}>
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </form>

          <p className="text-xs text-gray-400">
            Press &apos;Enter&apos; to send a message
          </p>
        </div>
      </CardContent>
    </Card>
  );
});
