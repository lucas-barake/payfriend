import { protectedVerifiedProcedure } from "$/server/api/trpc";
import { acceptGroupInviteInput } from "$/server/api/routers/user/group-invites/accept-group-invite/input";
import CUSTOM_EXCEPTIONS from "$/server/api/custom-exceptions";

const acceptGroupInvite = protectedVerifiedProcedure
  .input(acceptGroupInviteInput)
  .mutation(async ({ ctx, input }) => {
    const pendingInvite = await ctx.prisma.pendingInvite.findUnique({
      where: {
        userId_groupId: {
          userId: ctx.session.user.id,
          groupId: input.groupId,
        },
      },
      select: {
        role: true,
      },
    });

    if (!pendingInvite) {
      throw CUSTOM_EXCEPTIONS.BAD_REQUEST("No se encontró la invitación");
    }

    await ctx.prisma.groupsUsersMapping.create({
      data: {
        userId: ctx.session.user.id,
        groupId: input.groupId,
        role: pendingInvite.role,
      },
      select: {
        groupId: true,
      },
    });

    return ctx.prisma.pendingInvite.delete({
      where: {
        userId_groupId: {
          userId: ctx.session.user.id,
          groupId: input.groupId,
        },
      },
      select: {
        groupId: true,
      },
    });
  });

export default acceptGroupInvite;
