import { createTRPCRouter } from "$/server/api/trpc";
import { type Prisma } from "@prisma/client";
import { getOwnedDebts } from "$/server/api/routers/debts/queries/handlers/debts-as-lender/handler";
import { getSharedDebts } from "$/server/api/routers/debts/queries/handlers/debts-as-borrower/handler";
import { getPendingConfirmations } from "$/server/api/routers/debts/queries/handlers/get-pending-confirmations/handler";
import { getDebtBorrowersAndPendingBorrowers } from "$/server/api/routers/debts/queries/handlers/get-debt-borrowers-and-pending-borrowers/handler";

export const getUserDebtsSelect = {
  id: true,
  name: true,
  description: true,
  createdAt: true,
  amount: true,
  archived: true,
  dueDate: true,
  recurringFrequency: true,
  duration: true,
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
      balance: true,
    },
  },
  payments: {
    select: {
      id: true,
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
