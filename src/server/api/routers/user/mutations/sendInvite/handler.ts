import { protectedVerifiedProcedure } from "$/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { sendInviteInput } from "$/server/api/routers/user/mutations/sendInvite/input";
import { MAX_NUM_OF_GROUP_USERS } from "$/server/api/routers/user/restrictions";
import handleMainError from "$/server/log/handleMainError";
import { type Prisma } from "@prisma/client";

export const inviteUserSelect = {
  id: true,
  name: true,
  email: true,
  image: true,
} satisfies Prisma.UserSelect;

const sendInvite = protectedVerifiedProcedure
  .input(sendInviteInput)
  .mutation(async ({ ctx, input }) => {
    try {
      const hasPermission = await ctx.prisma.group.findFirst({
        where: {
          id: input.groupId,
          users: {
            some: {
              user: {
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

      const numOfUsers = await ctx.prisma.group.count({
        where: {
          id: input.groupId,
        },
      });

      if (numOfUsers >= MAX_NUM_OF_GROUP_USERS) {
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
            groupId: input.groupId,
            role: input.role,
          },
          select: {
            role: true,
            user: {
              select: inviteUserSelect,
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

export default sendInvite;
