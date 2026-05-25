const LOG_LEVEL = import.meta.env.VITE_LOG_LEVEL || 'warn';

const levels = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLevel = levels[LOG_LEVEL as keyof typeof levels] || levels.warn;

export const logger = {
  debug: (...args: unknown[]) => {
    if (currentLevel <= levels.debug) {
      console.debug(...args);
    }
  },
  info: (...args: unknown[]) => {
    if (currentLevel <= levels.info) {
      console.info(...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (currentLevel <= levels.warn) {
      console.warn(...args);
    }
  },
  error: (...args: unknown[]) => {
    if (currentLevel <= levels.error) {
      console.error(...args);
    }
  },
};