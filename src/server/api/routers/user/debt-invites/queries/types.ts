import { type inferProcedureOutput } from "@trpc/server";
import { type AppRouter } from "$/server/api/root";

export type GetDebtInvitesResult = inferProcedureOutput<
  AppRouter["user"]["getDebtsInvites"]
>;
