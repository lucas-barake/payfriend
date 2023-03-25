import { protectedVerifiedProcedure } from "$/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { sendInviteInput } from "$/server/api/routers/groupInvites/mutations/sendInvite/input";
import { MAX_NUM_OF_MEMBERS } from "$/server/api/routers/groupInvites/restrictions";
import handleMainError from "$/server/log/handleMainError";

const sendInviteHandler = protectedVerifiedProcedure
  .input(sendInviteInput)
  .mutation(async ({ ctx, input }) => {
    try {
      const hasPermission = await ctx.prisma.debtTable.findFirst({
        where: {
          id: input.debtTableId,
          collaborators: {
            some: {
              collaborator: {
                id: ctx.session.user.id,
              },
              role: "OWNER",
            },
          },
        },
      });

      if (!hasPermission) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No tienes permisos para invitar a este grupo",
        });
      }

      const numMembers = await ctx.prisma.debtTable.count({
        where: {
          id: input.debtTableId,
        },
      });

      if (numMembers >= MAX_NUM_OF_MEMBERS) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No puedes invitar más miembros a este grupo",
        });
      }

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
          message: "No existe un usuario con ese correo electrónico",
        });
      }

      if (user.id === ctx.session.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No puedes invitarte a ti mismo",
        });
      }

      try {
        return ctx.prisma.pendingInvite.create({
          data: {
            userId: user.id,
            debtTableId: input.debtTableId,
            role: input.role,
          },
          select: {
            role: true,
            user: {
              select: {
                name: true,
                email: true,
                image: true,
              },
            },
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Ya existe una invitación pendiente para ese usuario",
        });
      }
    } catch (error) {
      handleMainError(error);
    }
  });

export default sendInviteHandler;
