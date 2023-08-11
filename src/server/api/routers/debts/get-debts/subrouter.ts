import { createTRPCRouter } from "$/server/api/trpc";
import { type Prisma } from "@prisma/client";
import { getOwnedDebts } from "$/server/api/routers/debts/get-debts/debts-as-lender/handler";
import { getSharedDebts } from "$/server/api/routers/debts/get-debts/debts-as-borrower/handler";
import { getDebtBorrowersAndPendingBorrowers } from "$/server/api/routers/debts/get-debts/get-debt-borrowers-and-pending-borrowers/handler";

export const getUserDebtsSelect = {
  id: true,
  name: true,
  description: true,
  createdAt: true,
  amount: true,
  archived: true,
  dueDate: true,
  currency: true,
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
      payments: {
        select: {
          id: true,
          status: true,
          amount: true,
        },
      },
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
} satisfies Prisma.DebtSelect;

export const debtsQueries = createTRPCRouter({
  getOwnedDebts,
  getSharedDebts,
  getDebtBorrowersAndPendingBorrowers,
});
