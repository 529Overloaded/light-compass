import { useState, useEffect } from "react";
import type { Location } from "@/types/goldenHour";

interface UseGeolocationResult {
  location: Location | null;
  error: boolean;
  loading: boolean;
}

/**
 * Custom hook to get user's current geolocation
 */
export const useGeolocation = (): UseGeolocationResult => {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError(true);
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setError(false);
        setLoading(false);
      },
      () => {
        setError(true);
        setLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000, // Cache for 5 minutes
      }
    );
  }, []);

  return { location, error, loading };
};
