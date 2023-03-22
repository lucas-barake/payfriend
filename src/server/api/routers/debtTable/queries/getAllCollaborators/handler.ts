import { protectedVerifiedProcedure } from "$/server/api/trpc";
import { getAllCollaboratorsInput } from "$/server/api/routers/debtTable/queries/getAllCollaborators/input";

const getAllCollaboratorsHandler = protectedVerifiedProcedure
  .input(getAllCollaboratorsInput)
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

export default getAllCollaboratorsHandler;
