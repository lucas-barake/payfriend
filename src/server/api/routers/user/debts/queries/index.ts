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
  getOwnedDebts: protectedVerifiedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        debtsAsLender: {
          select: getUserDebtsSelect,
        },
      },
    });
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
