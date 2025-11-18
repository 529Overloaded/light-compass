import { useEffect, useState } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useGoldenHours } from "@/hooks/useGoldenHours";
import { TimeDisplay } from "@/components/TimeDisplay";
import { GoldenHourCard } from "@/components/GoldenHourCard";
import { CountdownDisplay } from "@/components/CountdownDisplay";
import { LocationInfo } from "@/components/LocationInfo";

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { location, error: locationError } = useGeolocation();
  const { goldenHours, countdown, isInGoldenHour } = useGoldenHours(location);

  // Update current time for TimeDisplay component
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);


  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-sm space-y-8">
        <TimeDisplay currentTime={currentTime} />

        {locationError && (
          <div className="text-center text-sm text-muted-foreground border border-border rounded p-3">
            Please enable location access in your browser to view golden hour times
          </div>
        )}

        {location && goldenHours && countdown && (
          <>
            <section className="space-y-6">
              <GoldenHourCard goldenHours={goldenHours} />
              <CountdownDisplay countdown={countdown} isInGoldenHour={isInGoldenHour} />
            </section>
            <LocationInfo location={location} />
          </>
        )}
      </div>
    </main>
  );
};

export default Index;
