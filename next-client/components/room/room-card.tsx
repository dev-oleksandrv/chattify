"use client";

import { Room } from "@/types/room-types";
import { Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface RoomCardProps {
  room: Room;
}

export const RoomCard = ({ room }: RoomCardProps) => (
  <Link href={`/room/${room.id}`}>
    <Card
      key={room.id}
      className="hover:shadow-lg transition-shadow duration-200 h-full"
    >
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 text-gray-800">
          {room.title}
        </h3>
        {room.onlineUsers.length > 0 ? (
          <div className="flex items-center">
            <Users className="h-5 w-5 text-gray-500 mr-2" />
            <div className="flex items-center">
              {room.onlineUsers.slice(0, 3).map((user, index) => (
                <div
                  key={user.id}
                  className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center -ml-2 first:ml-0 text-xs font-semibold text-indigo-800 border-2 border-white"
                  style={{ zIndex: 3 - index }}
                >
                  {user.username[0]}
                </div>
              ))}
              {room.onlineUsers.length > 3 && (
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center -ml-2 text-xs font-semibold text-gray-800 border-2 border-white">
                  +{room.onlineUsers.length - 3}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <p className="text-xs text-gray-500">No users online</p>
          </div>
        )}
      </CardContent>
    </Card>
  </Link>
);
