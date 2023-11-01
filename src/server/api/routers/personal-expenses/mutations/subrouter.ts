import CUSTOM_EXCEPTIONS from "$/server/api/custom-exceptions";
import {
  createPersonalExpenseInput,
  editPersonalExpenseInput,
} from "$/server/api/routers/personal-expenses/mutations/input";
import { createTRPCRouter, TRPCProcedures } from "$/server/api/trpc";
import { z } from "zod";

export const personalExpensesMutationsSubRouter = createTRPCRouter({
  create: TRPCProcedures.rateLimited({
    maxRequests: 10,
    window: 1,
    windowType: "minutes",
    uniqueId: "create-personal-expense",
  })
    .input(createPersonalExpenseInput)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.personalExpense.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
        select: {
          id: true,
        },
      });
    }),
  edit: TRPCProcedures.protected
    .input(editPersonalExpenseInput)
    .mutation(async ({ ctx, input }) => {
      const expense = await ctx.prisma.personalExpense.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        select: {
          id: true,
        },
      });

      if (!expense) {
        throw CUSTOM_EXCEPTIONS.NOT_FOUND("Expense not found");
      }

      return ctx.prisma.personalExpense.update({
        where: { id: input.id },
        data: {
          name: input.name,
          currency: input.currency,
          amount: input.amount,
          description: input.description,
        },
        select: {
          id: true,
        },
      });
    }),
  delete: TRPCProcedures.protected
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const expense = await ctx.prisma.personalExpense.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        select: {
          id: true,
        },
      });

      if (!expense) {
        throw CUSTOM_EXCEPTIONS.NOT_FOUND("Expense not found");
      }

      return ctx.prisma.personalExpense.delete({
        where: { id: input.id },
        select: {
          id: true,
        },
      });
    }),
});
