import { protectedVerifiedProcedure } from "$/server/api/trpc";
import { getAllGroupMembersInput } from "$/server/api/routers/groups/queries/getAllMembers/input";

const getAllMembersHandler = protectedVerifiedProcedure
  .input(getAllGroupMembersInput)
  .query(async ({ ctx, input }) => {
    const query = await ctx.prisma.debtTable.findUnique({
      where: {
        id: input,
      },
      select: {
        collaborators: {
          select: {
            role: true,
            collaborator: {
              select: {
                name: true,
                id: true,
                image: true,
              },
            },
          },
        },
        pendingInvites: {
          select: {
            role: true,
            user: {
              select: {
                name: true,
                id: true,
                image: true,
              },
            },
          },
        },
      },
    });

    return query;
  });

export default getAllMembersHandler;
