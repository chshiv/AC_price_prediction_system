import {CURRENT_LEVEL, LOG_LEVELS} from "../utils/constants"

class Logger {
  static instance = null;

  constructor() {
    if (Logger.instance) {
      return Logger.instance;
    }
    this.history = [];
    Logger.instance = this;
  }

  static getInstance() {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  _log(level, levelName, ...args) {
    if (level < CURRENT_LEVEL) return;

    const timestamp = new Date().toISOString();
    const entry = { timestamp, level: levelName, args };
    this.history.push(entry);

    const prefix = `[${timestamp}] [${levelName}]`;

    switch (levelName) {
      case "DEBUG": console.debug(prefix, ...args); break;
      case "INFO":  console.info(prefix, ...args);  break;
      case "WARN":  console.warn(prefix, ...args);  break;
      case "ERROR": console.error(prefix, ...args); break;
    }
  }

  debug(...args) { this._log(LOG_LEVELS.DEBUG, "DEBUG", ...args); }
  info(...args)  { this._log(LOG_LEVELS.INFO,  "INFO",  ...args); }
  warn(...args)  { this._log(LOG_LEVELS.WARN,  "WARN",  ...args); }
  error(...args) { this._log(LOG_LEVELS.ERROR, "ERROR", ...args); }

  getHistory() { return this.history; }
  clearHistory() { this.history = []; }
}

const logger = Logger.getInstance();
export default logger;