import { protectedVerifiedProcedure } from "$/server/api/trpc";
import { cancelInviteInput } from "$/server/api/routers/invites/mutations/cancelInvite/input";
import { TRPCError } from "@trpc/server";

const cancelInviteHandler = protectedVerifiedProcedure
  .input(cancelInviteInput)
  .mutation(async ({ ctx, input }) => {
    try {
      const res = await ctx.prisma.pendingInvite.delete({
        where: {
          userId_debtTableId: {
            userId: ctx.session.user.id,
            debtTableId: input.debtTableId,
          },
        },
      });

      if (!res) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No existe una invitación pendiente",
        });
      }

      return {
        rejectedDebtTableId: input.debtTableId,
      };
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error al rechazar la invitación",
      });
    }
  });

export default cancelInviteHandler;
