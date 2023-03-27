import { protectedVerifiedProcedure } from "$/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { getGroupByIdInput } from "$/server/api/routers/groups/queries/byId/input";

const byId = protectedVerifiedProcedure
  .input(getGroupByIdInput)
  .query(async ({ ctx, input }) => {
    const query = await ctx.prisma.group.findFirst({
      where: {
        id: input.id,
        users: {
          some: {
            userId: ctx.session.user.id,
          },
        },
      },
      include: {
        users: {
          select: {
            userId: true,
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

export default byId;
