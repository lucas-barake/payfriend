import { createTRPCRouter } from "$/server/api/trpc";
import { type Prisma } from "@prisma/client";
import { getOwnedDebts } from "$/server/api/routers/debts/queries/handlers/get-owned-debts/handler";
import { getSharedDebts } from "$/server/api/routers/debts/queries/handlers/get-shared-debts/handler";
import { getPendingConfirmations } from "$/server/api/routers/debts/queries/handlers/get-pending-confirmations/handler";
import { getDebtBorrowersAndPendingBorrowers } from "$/server/api/routers/debts/queries/handlers/get-debt-borrowers-and-pending-borrowers/handler";

export const getUserDebtsSelect = {
  id: true,
  name: true,
  description: true,
  createdAt: true,
  amount: true,
  archived: true,
  lender: {
    select: {
      id: true,
      name: true,
      image: true,
      email: true,
    },
  },
  borrowers: {
    select: {
      user: {
        select: {
          id: true,
          image: true,
          name: true,
          email: true,
        },
      },
      status: true,
    },
  },
} satisfies Prisma.DebtSelect;

export const debtsQueries = createTRPCRouter({
  getOwnedDebts,
  getSharedDebts,
  getPendingConfirmations,
  getDebtBorrowersAndPendingBorrowers,
});
