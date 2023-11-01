import {
  getPersonalExpensesInput,
  PERSONAL_EXPENSES_PAGINATION_LIMIT,
} from "$/server/api/routers/personal-expenses/queries/input";
import { createTRPCRouter, TRPCProcedures } from "$/server/api/trpc";
import { Prisma } from ".prisma/client";
import PersonalExpenseWhereInput = Prisma.PersonalExpenseWhereInput;

export const personalExpensesQueriesSubRouter = createTRPCRouter({
  get: TRPCProcedures.protected
    .input(getPersonalExpensesInput)
    .query(async ({ ctx, input }) => {
      const where = {
        userId: ctx.session.user.id,
      } satisfies PersonalExpenseWhereInput;

      const totalCount = await ctx.prisma.personalExpense.count({
        where,
      });

      const expenses = await ctx.prisma.personalExpense.findMany({
        where,
        take: PERSONAL_EXPENSES_PAGINATION_LIMIT,
        skip: input.skip,
        orderBy: [
          {
            amount: input.orderBy.amount ?? undefined,
          },
          {
            createdAt: input.orderBy.createdAt ?? "desc",
          },
        ],
        select: {
          id: true,
          name: true,
          amount: true,
          createdAt: true,
          description: true,
          updatedAt: true,
          currency: true,
        },
      });

      return {
        expenses,
        totalCount,
      };
    }),
});
