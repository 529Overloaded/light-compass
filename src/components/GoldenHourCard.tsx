import { memo } from "react";
import type { GoldenHourTimes } from "@/types/goldenHour";
import { formatTimeShort } from "@/utils/timeFormat";

interface GoldenHourCardProps {
  goldenHours: GoldenHourTimes;
}

/**
 * Displays morning and evening golden hour times
 */
export const GoldenHourCard = memo(({ goldenHours }: GoldenHourCardProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 text-center">
      <div className="space-y-1">
        <h2 className="text-xs text-muted-foreground uppercase tracking-wider">
          morning
        </h2>
        <div className="text-base sm:text-lg">
          <div>{formatTimeShort(goldenHours.morningStart)}</div>
          <div className="text-muted-foreground">—</div>
          <div>{formatTimeShort(goldenHours.morningEnd)}</div>
        </div>
      </div>

      <div className="space-y-1">
        <h2 className="text-xs text-muted-foreground uppercase tracking-wider">
          evening
        </h2>
        <div className="text-base sm:text-lg">
          <div>{formatTimeShort(goldenHours.eveningStart)}</div>
          <div className="text-muted-foreground">—</div>
          <div>{formatTimeShort(goldenHours.eveningEnd)}</div>
        </div>
      </div>
    </div>
  );
});

GoldenHourCard.displayName = "GoldenHourCard";
