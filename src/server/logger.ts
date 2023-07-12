import { env } from "$/env.mjs";

export const logger = {
  dev: (message: string): void => {
    if (env.NODE_ENV === "development") {
      console.log(`[🔨 DEV] ${message}`);
    }
  },
  error: (message: unknown): void => {
    console.log(
      `[❌ ERROR] ${
        typeof message === "string" ? message : JSON.stringify(message)
      }`
    );
  },
  info: (message: string): void => {
    console.log(`[ℹ️ INFO] ${message}`);
  },
  debug: (message: string): void => {
    console.log(`[🐛 DEBUG] ${message}`);
  },
};
