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
          image: true,
          name: true,
        },
      },
    },
  },
} satisfies Prisma.DebtSelect;

export const userGroupsQueries = createTRPCRouter({
  getOwnedDebts: protectedVerifiedProcedure.query(async ({ ctx }) => {
    const debtsAsLenderQuery = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        debtsAsLender: {
          select: getUserDebtsSelect,
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
        },
      },
    });
  }),
});
