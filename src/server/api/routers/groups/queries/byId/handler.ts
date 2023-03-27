import { protectedVerifiedProcedure } from "$/server/api/trpc";
import { getGroupByIdInput } from "$/server/api/routers/groups/queries/byId/input";
import CUSTOM_EXCEPTIONS from "$/server/api/custom-exceptions";

const getById = protectedVerifiedProcedure
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

    if (!query) throw CUSTOM_EXCEPTIONS.UNAUTHORIZED();

    return query;
  });

export default getById;
