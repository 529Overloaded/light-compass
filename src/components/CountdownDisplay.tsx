import { memo } from "react";
import type { Countdown } from "@/types/goldenHour";
import { padNumber } from "@/utils/timeFormat";

interface CountdownDisplayProps {
  countdown: Countdown;
  isInGoldenHour: boolean;
}

/**
 * Displays countdown to next golden hour or active status
 */
export const CountdownDisplay = memo(({ countdown, isInGoldenHour }: CountdownDisplayProps) => {
  if (isInGoldenHour) {
    return (
      <div className="text-center py-3 bg-accent/10 border border-accent rounded">
        <span className="text-sm tracking-wider text-accent-foreground uppercase">
          active
        </span>
      </div>
    );
  }

  return (
    <div className="text-center space-y-2">
      <h2 className="text-xs text-muted-foreground uppercase tracking-wider">
        {countdown.label}
      </h2>
      <div className="text-3xl sm:text-4xl font-light tracking-tight tabular-nums">
        {padNumber(countdown.hours)}:
        {padNumber(countdown.minutes)}:
        {padNumber(countdown.seconds)}
      </div>
    </div>
  );
});

CountdownDisplay.displayName = "CountdownDisplay";
