import { TRPCProcedures } from "$/server/api/trpc";
import { getRecentEmails } from "$/server/api/routers/debts/_lib/utils/stored-recent-emails";

export const getRecentEmailsHandler = TRPCProcedures.protected.query(
  async ({ ctx }) => {
    return getRecentEmails(ctx.session.user.id);
  }
);
