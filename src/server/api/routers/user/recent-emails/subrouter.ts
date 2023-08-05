import { createTRPCRouter } from "$/server/api/trpc";
import { getRecentEmailsHandler } from "$/server/api/routers/user/recent-emails/get-recent-emails/handler";

export const recentEmailsSubRouter = createTRPCRouter({
  getRecentEmails: getRecentEmailsHandler,
});
