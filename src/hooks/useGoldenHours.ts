import { useState, useEffect, useMemo } from "react";
import * as SunCalc from "suncalc";
import type { GoldenHourTimes, Location, NextGoldenHour, Countdown } from "@/types/goldenHour";

interface UseGoldenHoursResult {
  goldenHours: GoldenHourTimes | null;
  nextGoldenHour: NextGoldenHour | null;
  countdown: Countdown | null;
  isInGoldenHour: boolean;
}

/**
 * Custom hook to calculate golden hour times and countdown
 */
export const useGoldenHours = (location: Location | null): UseGoldenHoursResult => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [goldenHours, setGoldenHours] = useState<GoldenHourTimes | null>(null);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Calculate golden hours when location or date changes
  useEffect(() => {
    if (!location) return;

    const times = SunCalc.getTimes(currentTime, location.lat, location.lon);
    setGoldenHours({
      morningStart: times.sunrise,
      morningEnd: times.goldenHourEnd,
      eveningStart: times.goldenHour,
      eveningEnd: times.sunset,
    });
  }, [location, currentTime]);

  // Calculate next golden hour
  const nextGoldenHour = useMemo((): NextGoldenHour | null => {
    if (!goldenHours || !location) return null;

    const now = currentTime.getTime();
    const times: NextGoldenHour[] = [
      { time: goldenHours.morningStart, label: "morning" },
      { time: goldenHours.eveningStart, label: "evening" },
    ];

    // Find next golden hour today
    const upcoming = times.find(t => t.time.getTime() > now);
    if (upcoming) return upcoming;

    // If no more today, get tomorrow's morning golden hour
    const tomorrow = new Date(currentTime);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowTimes = SunCalc.getTimes(tomorrow, location.lat, location.lon);
    return { time: tomorrowTimes.sunrise, label: "morning" };
  }, [goldenHours, location, currentTime]);

  // Calculate countdown to next golden hour
  const countdown = useMemo((): Countdown | null => {
    if (!nextGoldenHour) return null;

    const diff = nextGoldenHour.time.getTime() - currentTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { hours, minutes, seconds, label: nextGoldenHour.label };
  }, [nextGoldenHour, currentTime]);

  // Check if currently in golden hour
  const isInGoldenHour = useMemo((): boolean => {
    if (!goldenHours) return false;
    const now = currentTime.getTime();
    return (
      (now >= goldenHours.morningStart.getTime() && now <= goldenHours.morningEnd.getTime()) ||
      (now >= goldenHours.eveningStart.getTime() && now <= goldenHours.eveningEnd.getTime())
    );
  }, [goldenHours, currentTime]);

  return { goldenHours, nextGoldenHour, countdown, isInGoldenHour };
};
