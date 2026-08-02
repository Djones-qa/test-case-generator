import dotenv from 'dotenv';
import { defaults } from './defaults';

dotenv.config();

export interface AppConfig {
  port: number;
  nodeEnv: string;
  logLevel: string;
}

export function loadConfig(): AppConfig {
  return {
    port: parseInt(process.env.PORT || String(defaults.port), 10),
    nodeEnv: process.env.NODE_ENV || defaults.nodeEnv,
    logLevel: process.env.LOG_LEVEL || defaults.logLevel,
  };
}

export const config = loadConfig();
