import { type inferProcedureOutput } from "@trpc/server";
import { type AppRouter } from "$/server/api/root";

export type GetPaymentsAsLenderResult = inferProcedureOutput<
  AppRouter["debts"]["getPaymentsAsLender"]
>;
