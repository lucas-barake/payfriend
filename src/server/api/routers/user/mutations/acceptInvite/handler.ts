import { protectedVerifiedProcedure } from "$/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { acceptInviteInput } from "$/server/api/routers/user/mutations/acceptInvite/input";

const acceptInvite = protectedVerifiedProcedure
  .input(acceptInviteInput)
  .mutation(async ({ ctx, input }) => {
    try {
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
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No existe una invitación pendiente",
        });
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
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error al aceptar la invitación",
      });
    }
  });

export default acceptInvite;
