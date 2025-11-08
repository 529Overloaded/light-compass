/**
 * Formats a date to HH:MM:SS format
 */
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit',
    hour12: false 
  });
};

/**
 * Formats a date to HH:MM format
 */
export const formatTimeShort = (date: Date): string => {
  return date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
};

/**
 * Pads a number with leading zeros
 */
export const padNumber = (num: number, length: number = 2): string => {
  return String(num).padStart(length, '0');
};
