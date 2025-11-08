import { memo } from "react";
import { formatTime } from "@/utils/timeFormat";

interface TimeDisplayProps {
  currentTime: Date;
}

/**
 * Displays the current time in large format
 */
export const TimeDisplay = memo(({ currentTime }: TimeDisplayProps) => {
  return (
    <header className="text-center space-y-1">
      <h1 className="text-sm tracking-wider text-muted-foreground uppercase">
        Golden Hour
      </h1>
      <time className="text-4xl sm:text-5xl font-light tracking-tight block">
        {formatTime(currentTime)}
      </time>
    </header>
  );
});

TimeDisplay.displayName = "TimeDisplay";
