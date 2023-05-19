import {
  createTRPCRouter,
  protectedVerifiedProcedure,
} from "$/server/api/trpc";
import { createGroupInput } from "$/server/api/routers/debts/mutations/input";
import CUSTOM_EXCEPTIONS from "$/server/api/custom-exceptions";
import { getUserDebtsSelect } from "$/server/api/routers/user/debts/queries";

export const debtsMutations = createTRPCRouter({
  createGroup: protectedVerifiedProcedure
    .input(createGroupInput)
    .mutation(async ({ ctx, input }) => {
      const lenderDebtsCount = await ctx.prisma.debt.count({
        where: {
          lenderId: ctx.session.user.id,
        },
      });

      const borrowerDebtsCount = await ctx.prisma.borrower.count({
        where: {
          userId: ctx.session.user.id,
        },
      });

      const totalDebtsCount = lenderDebtsCount + borrowerDebtsCount;

      if (totalDebtsCount >= 5) {
        throw CUSTOM_EXCEPTIONS.BAD_REQUEST("No puedes tener más de 5 deudas");
      }

      const createdDebt = await ctx.prisma.debt.create({
        data: {
          name: input.name,
          description: input.description,
          lender: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          amount: input.amount,
        },
        select: getUserDebtsSelect,
      });

      await ctx.prisma.pendingInvite.createMany({
        data: input.borrowerEmails.map((email) => ({
          inviteeEmail: email,
          debtId: createdDebt.id,
          inviterId: ctx.session.user.id,
        })),
      });

      return createdDebt;
    }),
});
