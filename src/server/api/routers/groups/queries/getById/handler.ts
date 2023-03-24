import { protectedVerifiedProcedure } from "$/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { getGroupByIdInput } from "$/server/api/routers/groups/queries/getById/input";

const getByIdHandler = protectedVerifiedProcedure
  .input(getGroupByIdInput)
  .query(async ({ ctx, input }) => {
    const query = await ctx.prisma.debtTable.findFirst({
      where: {
        id: input.id,
        collaborators: {
          some: {
            collaboratorId: ctx.session.user.id,
          },
        },
      },
      include: {
        collaborators: {
          select: {
            collaboratorId: true,
            role: true,
          },
        },
      },
    });

    if (!query) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No se encontró la tabla",
      });
    }

    return query;
  });

export default getByIdHandler;
