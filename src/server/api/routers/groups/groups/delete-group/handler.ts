import { protectedVerifiedProcedure } from "$/server/api/trpc";
import { deleteGroupInput } from "$/server/api/routers/groups/groups/delete-group/input";
import CUSTOM_EXCEPTIONS from "$/server/api/custom-exceptions";

const deleteGroup = protectedVerifiedProcedure
  .input(deleteGroupInput)
  .mutation(async ({ ctx, input }) => {
    const isOwner = await ctx.prisma.group.findFirst({
      where: {
        id: input.groupId,
        users: {
          some: {
            user: {
              id: ctx.session.user.id,
            },
            role: "OWNER",
          },
        },
      },
    });

    if (!isOwner) {
      throw CUSTOM_EXCEPTIONS.UNAUTHORIZED();
    }

    return ctx.prisma.group.delete({
      where: {
        id: input.groupId,
      },
      select: {
        id: true,
      },
    });
  });

export default deleteGroup;
