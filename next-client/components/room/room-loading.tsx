import { LoaderCircleIcon } from "lucide-react";
import { memo } from "react";

export const RoomLoading = memo(function RoomLoading() {
  return (
    <div className="absolute top-0 left-0 w-full h-full flex flex-col gap-4 justify-center items-center">
      <LoaderCircleIcon className="size-24 text-indigo-500 animate-spin" />

      <p>Loading Room...</p>
    </div>
  );
});
