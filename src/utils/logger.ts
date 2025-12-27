/**
 * Production-safe logger utility
 * Only logs in development builds (__DEV__ === true)
 * In production builds, console.log and console.warn are stripped for performance
 */


class Logger {
  private isDev = __DEV__;

  log = (...args: any[]) => {
    if (this.isDev) {
      console.log(...args);
    }
  };

  warn = (...args: any[]) => {
    if (this.isDev) {
      console.warn(...args);
    }
  };

  info = (...args: any[]) => {
    if (this.isDev) {
      console.info(...args);
    }
  };

  debug = (...args: any[]) => {
    if (this.isDev) {
      console.debug(...args);
    }
  };

  // Always log errors, even in production (for crash reporting/debugging)
  error = (...args: any[]) => {
    console.error(...args);
  };
}

// Export a singleton instance
export const logger = new Logger();

// Export individual methods for convenience
export const { log, warn, info, debug, error } = logger;
