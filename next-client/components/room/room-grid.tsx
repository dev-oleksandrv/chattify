import { cn } from "@/lib/utils";
import { memo, PropsWithChildren } from "react";

interface RoomGridProps {
  count: number;
}

export const RoomGrid = memo(function RoomGrid({
  children,
  count,
}: PropsWithChildren<RoomGridProps>) {
  return (
    <div
      className={cn("flex-1 overflow-auto", {
        "count-1": count === 1,
        "count-2": count > 1,
      })}
    >
      {children}
    </div>
  );
});
