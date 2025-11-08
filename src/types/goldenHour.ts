export interface GoldenHourTimes {
  morningStart: Date;
  morningEnd: Date;
  eveningStart: Date;
  eveningEnd: Date;
}

export interface Location {
  lat: number;
  lon: number;
}

export interface NextGoldenHour {
  time: Date;
  label: "morning" | "evening";
}

export interface Countdown {
  hours: number;
  minutes: number;
  seconds: number;
  label: "morning" | "evening";
}
