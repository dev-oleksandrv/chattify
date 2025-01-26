"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ReactNode, useState } from "react";

interface CreateRoomDialogProps {
  isOpen: boolean;
  trigger?: ReactNode;
  onClose: () => void;
}

export const CreateRoomDialog = ({
  isOpen,
  trigger,
  onClose,
}: CreateRoomDialogProps) => {
  const [roomTitle, setRoomTitle] = useState("");

  const submitHandler = () => {
    if (!roomTitle) return;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Room</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="room-title">Room Title</Label>
            <Input
              id="room-title"
              value={roomTitle}
              onChange={(e) => setRoomTitle(e.target.value)}
              placeholder="Enter room title"
            />
          </div>
          <Button
            className="bg-indigo-600 hover:bg-indigo-700"
            onClick={submitHandler}
            disabled={!roomTitle}
          >
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
