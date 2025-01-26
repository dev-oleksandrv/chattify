import { ArrowLeftIcon, CircleXIcon } from "lucide-react";
import { memo } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const RoomError = memo(() => {
  return (
    <div className="absolute top-0 left-0 w-full h-full flex flex-col gap-4 justify-center items-center">
      <CircleXIcon className="size-24 text-red-400" />

      <p>Room is not available for now.</p>

      <Button variant="outline" asChild>
        <Link href="/">
          <ArrowLeftIcon className="size-4" />
          Return Back
        </Link>
      </Button>
    </div>
  );
});
