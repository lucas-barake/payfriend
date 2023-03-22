import { protectedVerifiedProcedure } from "$/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { sendInviteInput } from "$/server/api/routers/invites/mutations/sendInvite/input";

const sendInviteHandler = protectedVerifiedProcedure
  .input(sendInviteInput)
  .mutation(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        email: input.email,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No existe un usuario con ese email",
      });
    }

    if (user.id === ctx.session.user.id) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No puedes invitarte a ti mismo",
      });
    }

    try {
      await ctx.prisma.pendingInvite.create({
        data: {
          userId: user.id,
          debtTableId: input.debtTableId,
          role: input.role,
        },
      });
    } catch (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Ya existe una invitación pendiente para ese usuario",
      });
    }

    return true;
  });

export default sendInviteHandler;
