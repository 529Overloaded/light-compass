import { memo } from "react";
import type { Location } from "@/types/goldenHour";

interface LocationInfoProps {
  location: Location;
}

/**
 * Displays user's location coordinates and timezone
 */
export const LocationInfo = memo(({ location }: LocationInfoProps) => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <footer className="text-center pt-4 border-t border-border">
      <div className="text-xs text-muted-foreground space-y-0.5">
        <div>
          {location.lat.toFixed(4)}° {location.lon.toFixed(4)}°
        </div>
        <div>{timezone}</div>
      </div>
    </footer>
  );
});

LocationInfo.displayName = "LocationInfo";
