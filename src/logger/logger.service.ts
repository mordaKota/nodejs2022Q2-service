import { ConsoleLogger, Injectable, LogLevel, Scope } from '@nestjs/common';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();
const logFileSize = process.env.LOG_FILE_SIZE || 1024;
const logLevel = process.env.LOG_LEVEL;
const logLevelsArr: LogLevel[] = ['error', 'warn', 'log', 'debug', 'verbose'];

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends ConsoleLogger {
  constructor() {
    super();
    this.logLevels = logLevelsArr.slice(0, 1 + Number(logLevel));
  }
  logLevels: LogLevel[];

  error(message: any, ...optionalParams) {
    if (!this.logLevels.includes('error')) return;
    super.error.apply(this, [`${message}`, optionalParams.join(' ')]);
    this.writeToFile(message + optionalParams.join(' '), 'errors');
  }
  warn(message: any, ...optionalParams) {
    if (!this.logLevels.includes('warn')) return;
    super.warn.apply(this, [`${message}`, optionalParams.join(' ')]);
    this.writeToFile(message + optionalParams.join(' '), 'common');
  }
  log(message: any, ...optionalParams) {
    if (!this.logLevels.includes('log')) return;
    super.log.apply(this, [`${message}`, optionalParams.join(' ')]);
    this.writeToFile(message, 'common');
  }
  debug(message: any, ...optionalParams) {
    if (!this.logLevels.includes('debug')) return;
    super.debug.apply(this, [`${message}`, optionalParams.join(' ')]);
    this.writeToFile(message, 'common');
  }
  verbose(message: any, ...optionalParams) {
    if (!this.logLevels.includes('warn')) return;
    super.warn.apply(this, [`${message}`, optionalParams.join(' ')]);
    this.writeToFile(message, 'common');
  }

  private writeToFile(message: string, type: string) {
    const logFileName = path.join(process.cwd(), 'logs', `${type}.log`);
    if (fs.existsSync(logFileName)) {
      const stat = fs.statSync(logFileName);
      const fileSize = Math.round(stat.size / 1024);
      if (fileSize < logFileSize) {
        fs.appendFileSync(logFileName, message + '\n', 'utf-8');
      } else {
        fs.writeFileSync(logFileName, message + '\n', 'utf-8');
      }
    } else {
      fs.writeFileSync(logFileName, message + '\n', 'utf-8');
    }
  }
}
