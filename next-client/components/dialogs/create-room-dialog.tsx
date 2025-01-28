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
import { FormEvent, ReactNode, useState } from "react";
import { LoaderCircleIcon } from "lucide-react";
import { client_createRoomRequest } from "@/api/client-api";
import { createRoomSchema } from "@/schemas/room-schemas";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [validationError, setValidationError] = useState("");
  const router = useRouter();

  const submitHandler = async (event: FormEvent) => {
    event.preventDefault();

    if (!roomTitle) return;

    const { success, data, error } = await createRoomSchema.safeParseAsync({
      title: roomTitle,
    });

    if (!success && error) {
      setValidationError(error.errors[0].message);
      return;
    }

    setValidationError("");
    setLoading(true);
    setError(false);

    try {
      const result = await client_createRoomRequest(data);

      router.push(`/room/${result.id}`);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Room</DialogTitle>
        </DialogHeader>
        <form onSubmit={submitHandler} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Something went wrong.</AlertTitle>
              <AlertDescription>Server returned error</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="room-title">Room Title</Label>
            <Input
              id="room-title"
              value={roomTitle}
              onChange={(e) => setRoomTitle(e.target.value)}
              placeholder="Enter room title"
            />
            {validationError && (
              <p className="text-xs text-red-400">{validationError}</p>
            )}
          </div>
          <Button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700"
            onClick={submitHandler}
            disabled={!roomTitle || loading}
          >
            Create
            {loading && <LoaderCircleIcon className="size-4 animate-spin" />}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
