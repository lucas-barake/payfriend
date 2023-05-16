import {
  createTRPCRouter,
  protectedVerifiedProcedure,
} from "$/server/api/trpc";
import {
  removeUserFromGroupFromInput,
  updateUserRoleInput,
} from "$/server/api/routers/debts/users/mutations/input";
import CUSTOM_EXCEPTIONS from "$/server/api/custom-exceptions";

export const groupUsersMutations = createTRPCRouter({
  removeUser: protectedVerifiedProcedure
    .input(removeUserFromGroupFromInput)
    .mutation(async ({ ctx, input }) => {
      const isOwner = await ctx.prisma.group.findFirst({
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
          id: true,
        },
      });
      if (!isOwner) throw CUSTOM_EXCEPTIONS.UNAUTHORIZED();

      if (input.userId === isOwner.id)
        throw CUSTOM_EXCEPTIONS.BAD_REQUEST(
          "No puedes eliminar a este usuario"
        );

      if (input.isPending) {
        return ctx.prisma.pendingInvite.delete({
          where: {
            userId_groupId: {
              userId: input.userId,
              groupId: input.groupId,
            },
          },
          select: {
            userId: true,
          },
        });
      }

      return ctx.prisma.groupsUsersMapping.delete({
        where: {
          userId_groupId: {
            userId: input.userId,
            groupId: input.groupId,
          },
        },
        select: {
          userId: true,
        },
      });
    }),
  updateUserRole: protectedVerifiedProcedure
    .input(updateUserRoleInput)
    .mutation(async ({ ctx, input }) => {
      if (input.userId === ctx.session.user.id) {
        throw CUSTOM_EXCEPTIONS.BAD_REQUEST("No puedes cambiar tu propio rol");
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
        throw CUSTOM_EXCEPTIONS.UNAUTHORIZED();
      }

      const member = group.users.find(({ userId }) => userId === input.userId);
      const pendingMember = group.pendingInvites.find(
        ({ userId }) => userId === input.userId
      );

      if (!member && !pendingMember) {
        throw CUSTOM_EXCEPTIONS.BAD_REQUEST("No se encontró el miembro");
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
    }),
});
