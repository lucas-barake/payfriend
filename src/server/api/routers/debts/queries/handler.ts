import {
  createTRPCRouter,
  protectedVerifiedProcedure,
} from "$/server/api/trpc";
import { BorrowerStatus, type Prisma } from "@prisma/client";
import { z } from "zod";
import CUSTOM_EXCEPTIONS from "$/server/api/custom-exceptions";

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
  getOwnedDebts: protectedVerifiedProcedure.query(async ({ ctx }) => {
    const debtsAsLenderQuery = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        debtsAsLender: {
          select: {
            ...getUserDebtsSelect,
          },
          orderBy: [
            {
              createdAt: "desc",
            },
            {
              archived: "asc",
            },
          ],
        },
      },
    });

    return {
      debtsAsLender: debtsAsLenderQuery?.debtsAsLender,
    };
  }),
  getSharedDebts: protectedVerifiedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        debtsAsBorrower: {
          select: {
            debt: {
              select: getUserDebtsSelect,
            },
          },
          orderBy: [
            {
              debt: {
                createdAt: "desc",
              },
            },
            {
              debt: {
                archived: "asc",
              },
            },
          ],
        },
      },
    });
  }),
  getPendingConfirmations: protectedVerifiedProcedure
    .input(
      z.object({
        debtId: z.string().cuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      const pendingConfirmations = await ctx.prisma.debt
        .findFirst({
          where: {
            id: input.debtId,
            lenderId: ctx.session.user.id,
          },
        })
        .borrowers({
          where: {
            status: BorrowerStatus.PENDING_CONFIRMATION,
          },
          select: {
            user: {
              select: {
                id: true,
                email: true,
                image: true,
              },
            },
          },
        });

      if (!pendingConfirmations) {
        throw CUSTOM_EXCEPTIONS.NOT_FOUND("No se encontró la deuda");
      }

      return {
        pendingConfirmations,
      };
    }),
  getDebtBorrowersAndPendingBorrowers: protectedVerifiedProcedure
    .input(
      z.object({
        debtId: z.string().cuid(),
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
          borrowers: {
            select: {
              id: true,
              status: true,
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
