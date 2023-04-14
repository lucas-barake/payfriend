import { protectedVerifiedProcedure } from "$/server/api/trpc";
import { removeUserFromGroupFromInput } from "$/server/api/routers/groups/users/remove-user/input";
import CUSTOM_EXCEPTIONS from "$/server/api/custom-exceptions";

const removeUser = protectedVerifiedProcedure
  .input(removeUserFromGroupFromInput)
  .mutation(async ({ ctx, input }) => {
    const isOwner = await ctx.prisma.group.findFirst({
      where: {
        id: input.groupId,
        users: {
          some: {
            userId: ctx.session.user.id,
            role: "OWNER",
          },
        },
      },
      select: {
        id: true,
      },
    });
    if (!isOwner) throw CUSTOM_EXCEPTIONS.UNAUTHORIZED();

    if (input.userId === isOwner.id)
      throw CUSTOM_EXCEPTIONS.BAD_REQUEST("No puedes eliminar a este usuario");

    if (input.isPending) {
      return ctx.prisma.pendingInvite.delete({
        where: {
          userId_groupId: {
            userId: input.userId,
            groupId: input.groupId,
          },
        },
        select: {
          userId: true,
        },
      });
    }

    return ctx.prisma.groupsUsersMapping.delete({
      where: {
        userId_groupId: {
          userId: input.userId,
          groupId: input.groupId,
        },
      },
      select: {
        userId: true,
      },
    });
  });

export default removeUser;
