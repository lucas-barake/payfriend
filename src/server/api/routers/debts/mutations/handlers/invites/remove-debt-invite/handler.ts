import { TRPCProcedures } from "$/server/api/trpc";
import { z } from "zod";
import CUSTOM_EXCEPTIONS from "$/server/api/custom-exceptions";

export const removeDebtInvite = TRPCProcedures.protected
  .input(
    z.object({
      debtId: z.string().uuid(),
      inviteeEmail: z.string().email(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const pendingInvite = await ctx.prisma.pendingInvite.findFirst({
      where: {
        debtId: input.debtId,
        inviterId: ctx.session.user.id,
      },
      select: {
        inviteeEmail: true,
      },
    });

    if (!pendingInvite) {
      throw CUSTOM_EXCEPTIONS.NOT_FOUND("Invitación no encontrada");
    }

    if (pendingInvite.inviteeEmail !== input.inviteeEmail) {
      throw CUSTOM_EXCEPTIONS.BAD_REQUEST("El email no coincide");
    }

    return ctx.prisma.pendingInvite.delete({
      where: {
        inviteeEmail_debtId: {
          debtId: input.debtId,
          inviteeEmail: input.inviteeEmail,
        },
      },
    });
  });
