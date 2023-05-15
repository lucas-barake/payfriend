import {
  createTRPCRouter,
  protectedVerifiedProcedure,
} from "$/server/api/trpc";
import { type Prisma } from "@prisma/client";

export const getUserGroupsSelect = {
  id: true,
  name: true,
  description: true,
  createdAt: true,
  users: {
    select: {
      user: {
        select: {
          image: true,
          name: true,
        },
      },
    },
  },
} satisfies Prisma.GroupSelect;

export const userGroupsQueries = createTRPCRouter({
  getOwnedGroups: protectedVerifiedProcedure.query(({ ctx }) => {
    return ctx.prisma.group.findMany({
      where: {
        users: {
          some: {
            userId: ctx.session.user.id,
            role: {
              equals: "OWNER",
            },
          },
        },
      },
      select: getUserGroupsSelect,
    });
  }),
  getSharedGroups: protectedVerifiedProcedure.query(({ ctx }) => {
    return ctx.prisma.group.findMany({
      where: {
        users: {
          some: {
            userId: ctx.session.user.id,
            role: {
              not: "OWNER",
            },
          },
        },
      },
      select: getUserGroupsSelect,
    });
  }),
});
