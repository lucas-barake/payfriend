import { protectedVerifiedProcedure } from "$/server/api/trpc";
import { cancelInviteInput } from "$/server/api/routers/user/mutations/rejectInvite/input";
import { TRPCError } from "@trpc/server";

const rejectInvite = protectedVerifiedProcedure
  .input(cancelInviteInput)
  .mutation(async ({ ctx, input }) => {
    try {
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
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No existe una invitación pendiente",
      });
    }
  });

export default rejectInvite;
