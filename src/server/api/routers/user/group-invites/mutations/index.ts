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
import { Prisma } from "@prisma/client";

export const userGroupInvitesMutations = createTRPCRouter({
  acceptDebtInvite: protectedVerifiedProcedure
    .input(acceptGroupInviteInput)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.$transaction(async (prisma) => {
        const pendingInvite = await prisma.pendingInvite.findUnique({
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

        const createdBorrower = await prisma.borrower.create({
          data: {
            userId: ctx.session.user.id,
            debtId: input.debtId,
          },
          select: {
            debtId: true,
          },
        });

        await prisma.pendingInvite.delete({
          where: {
            inviteeEmail_debtId: {
              inviteeEmail: ctx.session.user.email,
              debtId: input.debtId,
            },
          },
        });

        return createdBorrower;
      });
    }),
  declineDebtInvite: protectedVerifiedProcedure
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
  sendDebtInvite: protectedVerifiedProcedure
    .input(sendGroupInviteInput)
    .mutation(async ({ ctx, input }) => {
      const lender = await ctx.prisma.debt.findFirst({
        where: {
          id: input.groupId,
          lenderId: ctx.session.user.id,
        },
      });

      if (!lender) {
        throw CUSTOM_EXCEPTIONS.UNAUTHORIZED();
      }

      const numOfMembers = await ctx.prisma.borrower.count({
        where: {
          debtId: input.groupId,
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
            debt: {
              connect: {
                id: input.groupId,
              },
            },
            inviteeEmail: input.email,
            inviter: {
              connect: {
                id: ctx.session.user.id,
              },
            },
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
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            throw CUSTOM_EXCEPTIONS.BAD_REQUEST("El usuario ya está invitado");
          }
        }
        throw error;
      }
    }),
});
