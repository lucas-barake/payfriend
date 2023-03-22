import { protectedVerifiedProcedure } from "$/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { acceptInviteInput } from "$/server/api/routers/invites/mutations/acceptInvite/input";

const acceptInviteHandler = protectedVerifiedProcedure
  .input(acceptInviteInput)
  .mutation(async ({ ctx, input }) => {
    try {
      const pendingInvite = await ctx.prisma.pendingInvite.findUnique({
        where: {
          userId_debtTableId: {
            userId: ctx.session.user.id,
            debtTableId: input.debtTableId,
          },
        },
        select: {
          role: true,
        },
      });

      if (!pendingInvite) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No existe una invitación pendiente",
        });
      }

      await ctx.prisma.debtTablesCollaboratorsMapping.create({
        data: {
          collaboratorId: ctx.session.user.id,
          debtTableId: input.debtTableId,
          role: pendingInvite.role,
        },
      });

      await ctx.prisma.pendingInvite.delete({
        where: {
          userId_debtTableId: {
            userId: ctx.session.user.id,
            debtTableId: input.debtTableId,
          },
        },
      });

      return {
        acceptedDebtTableId: input.debtTableId,
      };
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error al aceptar la invitación",
      });
    }
  });

export default acceptInviteHandler;
