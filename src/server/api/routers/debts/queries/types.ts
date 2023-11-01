import { type inferProcedureOutput } from "@trpc/server";
import { type AppRouter } from "$/server/api/root";

export type DebtsAsBorrowerResult = inferProcedureOutput<
  AppRouter["debts"]["getSharedDebts"]
>;

export type GetDebtBorrowersAndPendingBorrowersResult = inferProcedureOutput<
  AppRouter["debts"]["getDebtBorrowersAndPendingBorrowers"]
>;

export type DebtsAsLenderResult = inferProcedureOutput<
  AppRouter["debts"]["getOwnedDebts"]
>;
