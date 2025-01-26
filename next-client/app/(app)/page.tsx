"use client";

import { CreateRoomDialog } from "@/components/dialogs/create-room-dialog";
import { DialogRenderer } from "@/components/dialogs/dialog-renderer";
import { RoomCard } from "@/components/room/room-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button, ButtonProps } from "@/components/ui/button";
import { ROOM_DATA } from "@/data/room-data";
import { Room } from "@/types/room-types";
import { InfoIcon, Plus } from "lucide-react";

const onlineRooms: Room[] = [];
const myRooms: Room[] = ROOM_DATA;

export default function HomePage() {
  return (
    <div className="space-y-6 py-4">
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">My Rooms</h2>
          <DialogRenderer Dialog={CreateRoomDialog} Trigger={DialogTrigger} />
        </div>
        {myRooms.length === 0 ? (
          <Alert className="bg-yellow-50 border-yellow-200">
            <InfoIcon className="h-5 w-5 text-yellow-600" />
            <AlertTitle className="text-yellow-800">
              No available rooms
            </AlertTitle>
            <AlertDescription className="text-yellow-700">
              You haven&apos;t created any room yet.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {myRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Online Rooms</h2>
        {onlineRooms.length === 0 ? (
          <Alert className="bg-yellow-50 border-yellow-200">
            <InfoIcon className="h-5 w-5 text-yellow-600" />
            <AlertTitle className="text-yellow-800">
              No available rooms
            </AlertTitle>
            <AlertDescription className="text-yellow-700">
              There are currently no online rooms available. Check back later or
              create your own room.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {/* Online rooms would be mapped here similar to My Rooms */}
          </div>
        )}
      </section>
    </div>
  );
}

const DialogTrigger = (props: ButtonProps) => (
  <Button className="bg-indigo-600 hover:bg-indigo-700" {...props}>
    <Plus className="mr-2 h-4 w-4" /> Create Room
  </Button>
);
