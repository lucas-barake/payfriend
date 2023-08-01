import { createTRPCRouter, TRPCProcedures } from "$/server/api/trpc";
import {
  acceptGroupInviteInput,
  declineGroupInviteInput,
} from "$/server/api/routers/user/debt-invites/mutations/input";
import CUSTOM_EXCEPTIONS from "$/server/api/custom-exceptions";
import { checkDebtLimitAndIncr } from "$/server/api/routers/debts/mutations/lib/utils/check-debt-limit-and-incr";

export const userGroupInvitesMutations = createTRPCRouter({
  acceptDebtInvite: TRPCProcedures.protected
    .input(acceptGroupInviteInput)
    .mutation(async ({ ctx, input }) => {
      await checkDebtLimitAndIncr(ctx);

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
  declineDebtInvite: TRPCProcedures.protected
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
