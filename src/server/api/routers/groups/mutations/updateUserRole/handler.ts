import { protectedVerifiedProcedure } from "$/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { updateUserRoleInput } from "$/server/api/routers/groups/mutations/updateUserRole/input";
import handleMainError from "$/server/log/handleMainError";

const updateUserRole = protectedVerifiedProcedure
  .input(updateUserRoleInput)
  .mutation(async ({ ctx, input }) => {
    try {
      if (input.userId === ctx.session.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No puedes cambiar tu propio rol",
        });
      }

      const group = await ctx.prisma.group.findFirst({
        where: {
          id: input.groupId,
          users: {
            some: {
              userId: ctx.session.user.id,
              role: "OWNER",
            },
          },
        },
        select: {
          users: {
            select: {
              userId: true,
            },
          },
          pendingInvites: {
            select: {
              userId: true,
            },
          },
        },
      });

      if (!group) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No se encontró el grupo",
        });
      }

      const member = group.users.find(({ userId }) => userId === input.userId);
      const pendingMember = group.pendingInvites.find(
        ({ userId }) => userId === input.userId
      );

      if (!member && !pendingMember) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No se encontró el miembro",
        });
      }

      if (member) {
        return ctx.prisma.groupsUsersMapping.update({
          where: {
            userId_groupId: input,
          },
          data: {
            role: input.role,
          },
          select: {
            userId: true,
            role: true,
          },
        });
      }

      return ctx.prisma.pendingInvite.update({
        where: {
          userId_groupId: input,
        },
        data: {
          role: input.role,
        },
        select: {
          userId: true,
          role: true,
        },
      });
    } catch (error) {
      handleMainError(error);
    }
  });
export default updateUserRole;
