import { logger } from "$/server/logger";
import { redis } from "$/server/redis";
import { MAX_STORED_RECENT_EMAILS } from "$/server/api/routers/debts/mutations/lib/constants/stored-recent-emails";

const STORED_RECENT_EMAILS_KEY_PREFIX = "stored-recent-emails";

export function generateStoredBorrowerEmailsKey(userId: string): string {
  return `${STORED_RECENT_EMAILS_KEY_PREFIX}:${userId}`;
}

type Args = {
  inviterId: string;
  email: string;
};

/**
 * Store a borrower's email in Redis associated with a lender.
 * @param {object} Args - The arguments for storing the borrower's email.
 * @param {string} Args.email - The email of the borrower to store.
 * @param {string} Args.inviterId - The ID of the lender user (inviter).
 * @returns {Promise<void>} A Promise that resolves when the operation is completed.
 */
export async function addRecentEmail({
  email,
  inviterId,
}: Args): Promise<void> {
  try {
    const key = generateStoredBorrowerEmailsKey(inviterId);

    const storedEmails = await redis.scard(key);

    if (storedEmails >= MAX_STORED_RECENT_EMAILS) {
      // Remove the oldest email
      await redis.spop(key, 1);
    }

    await redis.sadd(key, email);

    const oneMonthInSeconds = 60 * 60 * 24 * 30;
    await redis.expire(key, oneMonthInSeconds);
  } catch (error) {
    logger.error("Error storing borrower email in Redis", error);
  }
}

export async function getRecentEmails(inviterId: string): Promise<string[]> {
  try {
    const key = generateStoredBorrowerEmailsKey(inviterId);
    return await redis.smembers(key);
  } catch (error) {
    logger.error("Error getting stored borrower emails from Redis", error);
    return [];
  }
}

export async function removeRecentEmail({
  inviterId,
  email,
}: Args): Promise<void> {
  try {
    const key = generateStoredBorrowerEmailsKey(inviterId);
    await redis.srem(key, email);
  } catch (error) {
    logger.error("Error removing stored borrower email from Redis", error);
  }
}
