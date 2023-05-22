import {
  createTRPCRouter,
  protectedVerifiedProcedure,
} from "$/server/api/trpc";
import { type Prisma } from "@prisma/client";

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
    },
  },
  borrowers: {
    select: {
      user: {
        select: {
          id: true,
          image: true,
          name: true,
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
          select: getUserDebtsSelect,
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
});
