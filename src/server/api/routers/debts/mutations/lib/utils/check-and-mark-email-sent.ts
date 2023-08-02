import { type InnerTRPCContext } from "$/server/api/trpc";
import { logger } from "$/server/logger";
import CUSTOM_EXCEPTIONS from "$/server/api/custom-exceptions";

export const EMAIL_SENT_KEY_PREFIX = "email-sent";

export function generateEmailSentKey(email: string): string {
  return `${EMAIL_SENT_KEY_PREFIX}:${email}`;
}

type Args = {
  email: string;
  redis: InnerTRPCContext["redis"];
};

/**
 * Checks if an email has already been sent to a given email address within the last month.
 * If not, it marks the email as sent in Redis to avoid extra email invitations.
 * @param args { email: string, redis: Redis }
 * @returns Promise<void> A promise that resolves to void.
 * @throws INTERNAL_SERVER_ERROR custom exception when an error occurs on Redis (executing the command).
 **/
export async function checkAndMarkEmailSent(args: Args): Promise<boolean> {
  try {
    const key = generateEmailSentKey(args.email);
    const emailAlreadySent = (await args.redis.exists(key)) === 1;

    if (emailAlreadySent) {
      logger.info(`Email already sent to ${args.email}`);
      return true;
    }

    const oneMonthInSeconds = 60 * 60 * 24 * 30;
    await args.redis.set(key, "sent", "EX", oneMonthInSeconds);
    return false;
  } catch (error) {
    logger.error(error);
    throw CUSTOM_EXCEPTIONS.INTERNAL_SERVER_ERROR();
  }
}
