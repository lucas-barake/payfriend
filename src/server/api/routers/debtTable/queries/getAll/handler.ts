import { protectedVerifiedProcedure } from "$/server/api/trpc";

const getAllHandler = protectedVerifiedProcedure.query(async ({ ctx }) => {
  const query = await ctx.prisma.debtTable.findMany({
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
    include: {
      collaborators: {
        select: {
          collaboratorId: true,
        },
      },
    },
  });

  return {
    debtTables: query,
  };
});

export default getAllHandler;
