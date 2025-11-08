import { useEffect, useState } from "react";
import * as SunCalc from "suncalc";

interface GoldenHourTimes {
  morningStart: Date;
  morningEnd: Date;
  eveningStart: Date;
  eveningEnd: Date;
}

interface Location {
  lat: number;
  lon: number;
}

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState<Location | null>(null);
  const [goldenHours, setGoldenHours] = useState<GoldenHourTimes | null>(null);
  const [locationError, setLocationError] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setLocationError(false);
      },
      () => {
        setLocationError(true);
      }
    );

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!location) return;

    const times = SunCalc.getTimes(currentTime, location.lat, location.lon);
    setGoldenHours({
      morningStart: times.dawn,
      morningEnd: times.goldenHourEnd,
      eveningStart: times.goldenHour,
      eveningEnd: times.dusk,
    });
  }, [location, currentTime]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: false 
    });
  };

  const formatTimeShort = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const getNextGoldenHour = (): { time: Date; label: string } | null => {
    if (!goldenHours) return null;

    const now = currentTime.getTime();
    const times = [
      { time: goldenHours.morningStart, label: "morning" },
      { time: goldenHours.eveningStart, label: "evening" },
    ];

    // Find next golden hour today
    const upcoming = times.find(t => t.time.getTime() > now);
    if (upcoming) return upcoming;

    // If no more today, get tomorrow's morning golden hour
    const tomorrow = new Date(currentTime);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowTimes = SunCalc.getTimes(tomorrow, location!.lat, location!.lon);
    return { time: tomorrowTimes.dawn, label: "morning" };
  };

  const getCountdown = () => {
    const next = getNextGoldenHour();
    if (!next) return null;

    const diff = next.time.getTime() - currentTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { hours, minutes, seconds, label: next.label };
  };

  const isInGoldenHour = () => {
    if (!goldenHours) return false;
    const now = currentTime.getTime();
    return (
      (now >= goldenHours.morningStart.getTime() && now <= goldenHours.morningEnd.getTime()) ||
      (now >= goldenHours.eveningStart.getTime() && now <= goldenHours.eveningEnd.getTime())
    );
  };

  const countdown = getCountdown();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-sm space-y-8">
        
        <header className="text-center space-y-1">
          <h1 className="text-sm tracking-wider text-muted-foreground uppercase">Golden Hour</h1>
          <time className="text-4xl sm:text-5xl font-light tracking-tight block">
            {formatTime(currentTime)}
          </time>
        </header>

        {locationError && (
          <div className="text-center text-sm text-muted-foreground border border-border rounded p-3">
            location_required
          </div>
        )}

        {location && goldenHours && (
          <>
            <section className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="space-y-1">
                  <h2 className="text-xs text-muted-foreground uppercase tracking-wider">morning</h2>
                  <div className="text-base sm:text-lg">
                    <div>{formatTimeShort(goldenHours.morningStart)}</div>
                    <div className="text-muted-foreground">—</div>
                    <div>{formatTimeShort(goldenHours.morningEnd)}</div>
                  </div>
                </div>

                <div className="space-y-1">
                  <h2 className="text-xs text-muted-foreground uppercase tracking-wider">evening</h2>
                  <div className="text-base sm:text-lg">
                    <div>{formatTimeShort(goldenHours.eveningStart)}</div>
                    <div className="text-muted-foreground">—</div>
                    <div>{formatTimeShort(goldenHours.eveningEnd)}</div>
                  </div>
                </div>
              </div>

              {isInGoldenHour() && (
                <div className="text-center py-3 bg-accent/10 border border-accent rounded">
                  <span className="text-sm tracking-wider text-accent-foreground uppercase">
                    active
                  </span>
                </div>
              )}

              {!isInGoldenHour() && countdown && (
                <div className="text-center space-y-2">
                  <h2 className="text-xs text-muted-foreground uppercase tracking-wider">
                    {countdown.label}
                  </h2>
                  <div className="text-3xl sm:text-4xl font-light tracking-tight tabular-nums">
                    {String(countdown.hours).padStart(2, '0')}:
                    {String(countdown.minutes).padStart(2, '0')}:
                    {String(countdown.seconds).padStart(2, '0')}
                  </div>
                </div>
              )}
            </section>

            <footer className="text-center pt-4 border-t border-border">
              <div className="text-xs text-muted-foreground space-y-0.5">
                <div>{location.lat.toFixed(4)}° {location.lon.toFixed(4)}°</div>
                <div>{Intl.DateTimeFormat().resolvedOptions().timeZone}</div>
              </div>
            </footer>
          </>
        )}
      </div>
    </main>
  );
};

export default Index;
