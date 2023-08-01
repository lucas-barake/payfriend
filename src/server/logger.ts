import { env } from "$/env.mjs";

export const logger = {
  dev: (...data: unknown[]): void => {
    if (env.NODE_ENV === "development") {
      console.log("[🔨 DEV]", ...data);
    }
  },
  error: (...error: unknown[]): void => {
    console.log("[❌ ERROR]", ...error);
  },
  info: (...message: unknown[]): void => {
    console.log("[ℹ️ INFO]", ...message);
  },
  debug: (message: string): void => {
    if (env.NODE_ENV === "development") {
      console.log(`[🐛 DEBUG] ${message}`);
    }
  },
};
