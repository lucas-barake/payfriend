import { protectedVerifiedProcedure } from "$/server/api/trpc";
import { type Prisma } from "@prisma/client";

const select = {
  id: true,
  name: true,
  description: true,
  createdAt: true,
  collaborators: {
    select: {
      collaborator: {
        select: {
          image: true,
          name: true,
        },
      },
    },
  },
} satisfies Prisma.DebtTableSelect;

export const getUserOwned = protectedVerifiedProcedure.query(({ ctx }) => {
  return ctx.prisma.debtTable.findMany({
    where: {
      collaborators: {
        some: {
          collaboratorId: ctx.session.user.id,
          role: {
            equals: "OWNER",
          },
        },
      },
    },
    select,
  });
});

export const getUserShared = protectedVerifiedProcedure.query(({ ctx }) => {
  return ctx.prisma.debtTable.findMany({
    where: {
      collaborators: {
        some: {
          collaboratorId: ctx.session.user.id,
          role: {
            not: "OWNER",
          },
        },
      },
    },
    select,
  });
});
