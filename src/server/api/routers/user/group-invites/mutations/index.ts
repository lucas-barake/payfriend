import {
  createTRPCRouter,
  protectedVerifiedProcedure,
} from "$/server/api/trpc";
import {
  acceptGroupInviteInput,
  declineGroupInviteInput,
  sendGroupInviteInput,
} from "$/server/api/routers/user/group-invites/mutations/input";
import CUSTOM_EXCEPTIONS from "$/server/api/custom-exceptions";
import { MAX_NUM_OF_GROUP_USERS } from "$/server/api/routers/user/restrictions";
import { inviteUserSelect } from "$/server/api/routers/user/group-invites/mutations/select";

export const userGroupInvitesMutations = createTRPCRouter({
  acceptGroupInvite: protectedVerifiedProcedure
    .input(acceptGroupInviteInput)
    .mutation(async ({ ctx, input }) => {
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
        throw CUSTOM_EXCEPTIONS.BAD_REQUEST("No se encontró la invitación");
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
    }),
  declineGroupInvite: protectedVerifiedProcedure
    .input(declineGroupInviteInput)
    .mutation(async ({ ctx, input }) => {
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
    }),
  sendGroupInvite: protectedVerifiedProcedure
    .input(sendGroupInviteInput)
    .mutation(async ({ ctx, input }) => {
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
        throw CUSTOM_EXCEPTIONS.UNAUTHORIZED();
      }

      const numOfUsers = await ctx.prisma.group.count({
        where: {
          id: input.groupId,
        },
      });

      if (numOfUsers >= MAX_NUM_OF_GROUP_USERS) {
        throw CUSTOM_EXCEPTIONS.BAD_REQUEST(
          "El grupo ya tiene el máximo de usuarios"
        );
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
        throw CUSTOM_EXCEPTIONS.BAD_REQUEST("El usuario no existe");
      }

      if (user.id === ctx.session.user.id) {
        throw CUSTOM_EXCEPTIONS.BAD_REQUEST("No puedes invitarte a ti mismo");
      }

      try {
        return await ctx.prisma.pendingInvite.create({
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
        throw CUSTOM_EXCEPTIONS.BAD_REQUEST("El usuario ya está invitado");
      }
    }),
});
