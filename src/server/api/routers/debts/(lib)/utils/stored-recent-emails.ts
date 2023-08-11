import { logger } from "$/server/logger";
import { redis } from "$/server/redis";
import { MAX_STORED_RECENT_EMAILS } from "$/server/api/routers/debts/(lib)/constants/stored-recent-emails";

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

    // Remove the email from the list if it already exists
    await redis.lrem(key, 0, email);

    // If the email is not in the list, it will be inserted at the beginning
    await redis.lpush(key, email);

    // Trim the list to the maximum allowed length
    await redis.ltrim(key, 0, MAX_STORED_RECENT_EMAILS - 1);

    const oneMonthInSeconds = 60 * 60 * 24 * 30;
    await redis.expire(key, oneMonthInSeconds);
  } catch (error) {
    logger.error("Error storing borrower email in Redis", error);
  }
}

export async function getRecentEmails(inviterId: string): Promise<string[]> {
  try {
    const key = generateStoredBorrowerEmailsKey(inviterId);
    return await redis.lrange(key, 0, -1);
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
    await redis.lrem(key, 0, email);
  } catch (error) {
    logger.error("Error removing stored borrower email from Redis", error);
  }
}
