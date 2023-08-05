import { logger } from "$/server/logger";
import CUSTOM_EXCEPTIONS from "$/server/api/custom-exceptions";
import { redis } from "$/server/redis";

export const EMAIL_SENT_KEY_PREFIX = "email-sent";

export function generateEmailSentKey(email: string): string {
  return `${EMAIL_SENT_KEY_PREFIX}:${email}`;
}

/**
 * Checks if an email has already been sent to a given email address within the last month.
 * If not, it marks the email as sent in Redis to avoid extra email invitations.
 * @param  {string} email The email address to check.
 * @returns Promise<void> A promise that resolves to void.
 * @throws INTERNAL_SERVER_ERROR custom exception when an error occurs on Redis (executing the command).
 **/
export async function checkAndMarkEmailSent(email: string): Promise<boolean> {
  try {
    const key = generateEmailSentKey(email);
    const emailAlreadySent = (await redis.exists(key)) === 1;

    if (emailAlreadySent) {
      logger.info(`Email already sent to ${email}`);
      return true;
    }

    const fourteenDaysInSeconds = 60 * 60 * 24 * 14;
    await redis.set(key, "", "EX", fourteenDaysInSeconds);
    return false;
  } catch (error) {
    logger.error(error);
    throw CUSTOM_EXCEPTIONS.INTERNAL_SERVER_ERROR();
  }
}
