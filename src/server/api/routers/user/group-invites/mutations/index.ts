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

export const userGroupInvitesMutations = createTRPCRouter({
  acceptGroupInvite: protectedVerifiedProcedure
    .input(acceptGroupInviteInput)
    .mutation(async ({ ctx, input }) => {
      const pendingInvite = await ctx.prisma.pendingInvite.findUnique({
        where: {
          inviteeEmail_debtId: {
            inviteeEmail: ctx.session.user.email,
            debtId: input.debtId,
          },
        },
        select: {
          debt: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!pendingInvite) {
        throw CUSTOM_EXCEPTIONS.BAD_REQUEST("No se encontró la invitación");
      }

      await ctx.prisma.borrower.create({
        data: {
          userId: ctx.session.user.id,
          debtId: input.debtId,
        },
        select: {
          debtId: true,
        },
      });

      return ctx.prisma.pendingInvite.delete({
        where: {
          inviteeEmail_debtId: {
            inviteeEmail: ctx.session.user.email,
            debtId: input.debtId,
          },
        },
        select: {
          debtId: true,
        },
      });
    }),
  declineGroupInvite: protectedVerifiedProcedure
    .input(declineGroupInviteInput)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.pendingInvite.delete({
        where: {
          inviteeEmail_debtId: {
            inviteeEmail: ctx.session.user.email,
            debtId: input.debtId,
          },
        },
        select: {
          debtId: true,
        },
      });
    }),
  sendGroupInvite: protectedVerifiedProcedure
    .input(sendGroupInviteInput)
    .mutation(async ({ ctx, input }) => {
      const hasPermission = await ctx.prisma.user.findFirst({
        where: {
          debtsAsLender: {
            some: {
              id: input.groupId,
            },
          },
        },
      });

      if (!hasPermission) {
        throw CUSTOM_EXCEPTIONS.UNAUTHORIZED();
      }

      const numOfMembers = await ctx.prisma.borrower.count({
        where: {
          debt: {
            id: input.groupId,
          },
        },
      });

      if (numOfMembers >= MAX_NUM_OF_GROUP_USERS) {
        throw CUSTOM_EXCEPTIONS.BAD_REQUEST(
          "El grupo ya tiene el máximo de usuarios"
        );
      }

      try {
        return await ctx.prisma.pendingInvite.create({
          data: {
            debtId: input.groupId,
            inviteeEmail: input.email,
            inviterId: ctx.session.user.id,
          },
          select: {
            inviteeEmail: true,
            debt: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });
      } catch (error) {
        throw CUSTOM_EXCEPTIONS.BAD_REQUEST("El usuario ya está invitado");
      }
    }),
});
