import { type AppRouter } from "$/server/api/root";
import { type inferProcedureOutput } from "@trpc/server";

export type GetPersonalExpensesResult = inferProcedureOutput<
  AppRouter["personalExpenses"]["get"]
>;
