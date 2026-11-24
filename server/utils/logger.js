/**
 * Structured Logger Utility
 */

const levels = {
  INFO: "INFO",
  WARN: "WARN",
  ERROR: "ERROR",
  DEBUG: "DEBUG"
};

function format(level, message, ...args) {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level}] ${message}`;
}

const logger = {
  info: (msg, ...args) => console.log(format(levels.INFO, msg), ...args),
  warn: (msg, ...args) => console.warn(format(levels.WARN, msg), ...args),
  error: (msg, ...args) => console.error(format(levels.ERROR, msg), ...args),
  debug: (msg, ...args) => {
    if (process.env.DEBUG || process.env.NODE_ENV === "development") {
      console.debug(format(levels.DEBUG, msg), ...args);
    }
  }
};

module.exports = logger;
