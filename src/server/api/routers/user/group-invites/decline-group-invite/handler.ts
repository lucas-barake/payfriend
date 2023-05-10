import { protectedVerifiedProcedure } from "$/server/api/trpc";
import { cancelInviteInput } from "$/server/api/routers/user/group-invites/decline-group-invite/input";

const declineGroupInvite = protectedVerifiedProcedure
  .input(cancelInviteInput)
  .mutation(async ({ ctx, input }) => {
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

export default declineGroupInvite;
