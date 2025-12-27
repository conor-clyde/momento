import { QUOTES } from "../constants/quotes";
// Get quote of the day based on day of year
export const getQuoteOfDay = (): string => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    return QUOTES[dayOfYear % QUOTES.length];
  };
