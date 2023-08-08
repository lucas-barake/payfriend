import { type inferProcedureOutput } from "@trpc/server";
import { type AppRouter } from "$/server/api/root";

export type DebtsAsBorrowerResult = inferProcedureOutput<
  AppRouter["debts"]["getSharedDebts"]
>;
