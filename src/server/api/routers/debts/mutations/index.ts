import {
  createTRPCRouter,
  protectedVerifiedProcedure,
} from "$/server/api/trpc";
import { createGroupInput } from "$/server/api/routers/debts/mutations/input";
import CUSTOM_EXCEPTIONS from "$/server/api/custom-exceptions";
import { getUserDebtsSelect } from "$/server/api/routers/user/debts/queries";

export const debtsMutations = createTRPCRouter({
  create: protectedVerifiedProcedure
    .input(createGroupInput)
    .mutation(async ({ ctx, input }) => {
      const debtsCount: {
        lenderDebtsCount: number;
        borrowerDebtsCount: number;
      } = await ctx.prisma.$queryRaw`
          SELECT (SELECT COUNT(*) FROM "Debt" WHERE "lenderId" = ${ctx.session.user.id})   AS "lenderDebtsCount",
                 (SELECT COUNT(*) FROM "Borrower" WHERE "userId" = ${ctx.session.user.id}) AS "borrowerDebtsCount"
      `;
      const totalDebtsCount =
        debtsCount.lenderDebtsCount + debtsCount.borrowerDebtsCount;

      if (totalDebtsCount >= 5) {
        throw CUSTOM_EXCEPTIONS.BAD_REQUEST("No puedes tener más de 5 deudas");
      }

      return ctx.prisma.$transaction(async (prisma) => {
        const createdDebt = await prisma.debt.create({
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

        await prisma.pendingInvite.createMany({
          data: input.borrowerEmails.map((email) => ({
            inviteeEmail: email,
            debtId: createdDebt.id,
            inviterId: ctx.session.user.id,
          })),
        });

        return createdDebt;
      });
    }),
});
