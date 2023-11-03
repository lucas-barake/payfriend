import { createTRPCRouter, TRPCProcedures } from "$/server/api/trpc";
import { PaymentStatus, Prisma } from "@prisma/client";
import { DEBTS_QUERY_PAGINATION_LIMIT } from "$/server/api/routers/debts/queries/(lib)/constants";
import {
  debtsAsBorrowerInput,
  debtsAsLenderInput,
} from "$/server/api/routers/debts/queries/input";
import { z } from "zod";
import CUSTOM_EXCEPTIONS from "$/server/api/custom-exceptions";
import DebtWhereInput = Prisma.DebtWhereInput;

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
  getOwnedDebts: TRPCProcedures.protected
    .input(debtsAsLenderInput)
    .query(async ({ ctx, input }) => {
      const where = {
        ...(input.partnerEmail && {
          borrowers: {
            some: {
              user: {
                email: input.partnerEmail,
              },
            },
          },
        }),
        ...(input.status === "active" && {
          archived: {
            equals: null,
          },
        }),
        ...(input.status === "archived" && {
          archived: {
            not: {
              equals: null,
            },
          },
        }),
        lenderId: ctx.session.user.id,
        payments:
          input.status === "pending-confirmation"
            ? {
                some: {
                  status: {
                    equals: PaymentStatus.PENDING_CONFIRMATION,
                  },
                },
              }
            : undefined,
      } satisfies DebtWhereInput;

      const [debts, count] = await ctx.prisma.$transaction([
        ctx.prisma.debt.findMany({
          where,
          orderBy: [
            {
              createdAt: input.sort,
            },
          ],
          take: DEBTS_QUERY_PAGINATION_LIMIT,
          skip: input.skip,
          select: {
            ...getUserDebtsSelect,
          },
        }),
        ctx.prisma.debt.count({
          where,
        }),
      ]);

      return {
        debts,
        count,
      };
    }),
  getSharedDebts: TRPCProcedures.protected
    .input(debtsAsBorrowerInput)
    .query(async ({ ctx, input }) => {
      const where = {
        ...(input.status === "archived" && {
          archived: {
            not: {
              equals: null,
            },
          },
        }),
        ...(input.partnerEmail && {
          lender: {
            email: input.partnerEmail,
          },
        }),
        borrowers: {
          some: {
            userId: ctx.session.user.id,
            ...(input.status === "archived" && {
              balance: {
                equals: 0,
              },
              payments: {
                every: {
                  status: {
                    in: [PaymentStatus.PAID, PaymentStatus.MISSED],
                  },
                },
              },
            }),
          },
        },
      } satisfies DebtWhereInput;

      const [debts, count] = await ctx.prisma.$transaction([
        ctx.prisma.debt.findMany({
          where,
          orderBy: [
            {
              createdAt: input.sort,
            },
          ],
          take: DEBTS_QUERY_PAGINATION_LIMIT,
          skip: input.skip,
          select: {
            ...getUserDebtsSelect,
          },
        }),
        ctx.prisma.debt.count({
          where,
        }),
      ]);

      return {
        debts,
        count,
      };
    }),
  getDebtBorrowersAndPendingBorrowers: TRPCProcedures.protected
    .input(
      z.object({
        debtId: z.string().uuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      const debt = await ctx.prisma.debt.findFirst({
        where: {
          id: input.debtId,
          lenderId: ctx.session.user.id,
        },
        select: {
          id: true,
          currency: true,
          borrowers: {
            select: {
              balance: true,
              user: {
                select: {
                  id: true,
                  email: true,
                  image: true,
                  name: true,
                },
              },
            },
          },
          pendingInvites: {
            select: {
              inviteeEmail: true,
            },
          },
        },
      });

      if (!debt) {
        throw CUSTOM_EXCEPTIONS.NOT_FOUND("No se encontró la deuda");
      }

      return {
        borrowers: debt.borrowers,
        pendingBorrowers: debt.pendingInvites,
      };
    }),
});
