/**
 * Checks if a date is valid
 */
export function isValidDate(date: Date): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Formats a date to short format (e.g., "Jan 15, 2024")
 */
export function formatShortDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}


/**
 * Formats a date to month and year (e.g., "January 2024")
 */
export function formatMonthYear(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}



/**
 * Formats a date with time (e.g., "Jan 15, 2024 at 3:45 PM")
 */
export function formatDateTime(date: Date): string {
  const dateStr = formatShortDate(date);
  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${dateStr} at ${timeStr}`;
}

/**
 * Formats a date to last capture format (e.g., "Mon 15th Jan")
 */
export function formatLastCaptureDate(date: Date): string {
  const dayNames = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const dayName = dayNames[date.getDay()];
  const day = date.getDate();
  const month = monthNames[date.getMonth()];

  const getOrdinal = (n: number): string => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
  };

  return `${dayName} ${getOrdinal(day)} ${month}`;
}


