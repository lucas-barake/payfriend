import { protectedVerifiedProcedure } from "$/server/api/trpc";

const getAllSharedHandler = protectedVerifiedProcedure.query(
  async ({ ctx }) => {
    const query = await ctx.prisma.debtTable.findMany({
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
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        _count: {
          select: {
            collaborators: true,
          },
        },
      },
    });

    return query;
  }
);

export default getAllSharedHandler;
