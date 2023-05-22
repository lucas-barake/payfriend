import {
  createTRPCRouter,
  protectedVerifiedProcedure,
} from "$/server/api/trpc";
import {
  acceptGroupInviteInput,
  declineGroupInviteInput,
} from "$/server/api/routers/user/debt-invites/mutations/input";
import CUSTOM_EXCEPTIONS from "$/server/api/custom-exceptions";
import { rawQueries } from "$/server/api/routers/(routers-lib)/raw-queries";

export const userGroupInvitesMutations = createTRPCRouter({
  acceptDebtInvite: protectedVerifiedProcedure
    .input(acceptGroupInviteInput)
    .mutation(async ({ ctx, input }) => {
      const debtsCount = await rawQueries.getUserDebtCount(
        ctx.prisma,
        ctx.session.user.id
      );
      const totalDebtsCount =
        debtsCount.lenderDebtsCount + debtsCount.borrowerDebtsCount;

      if (totalDebtsCount >= 5) {
        throw CUSTOM_EXCEPTIONS.BAD_REQUEST("No puedes tener más de 5 deudas");
      }

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
});
