import { TRPCProcedures } from "$/server/api/trpc";
import { getUserDebtsSelect } from "$/server/api/routers/debts/queries";
import { debtsAsLenderInput } from "$/server/api/routers/debts/queries/handlers/debts-as-lender/input";
import { DEBTS_QUERY_PAGINATION_LIMIT } from "$/server/api/routers/debts/queries/handlers/lib/constants";
import { PaymentStatus } from "@prisma/client";

export const getOwnedDebts = TRPCProcedures.protected
  .input(debtsAsLenderInput)
  .query(async ({ ctx, input }) => {
    const [debts, count] = await ctx.prisma.$transaction([
      ctx.prisma.debt.findMany({
        where: {
          ...((input.status === "archived" || input.status === "active") && {
            archived: input.status === "archived",
          }),
          lenderId: ctx.session.user.id,
          payments:
            input.status === "pending-confirmation"
              ? {
                  some: {
                    status: {
                      equals: PaymentStatus.PENDING_CONFIRMATION,
                    },
                  },
                }
              : undefined,
        },
        orderBy: [
          {
            createdAt: input.sort,
          },
        ],
        take: DEBTS_QUERY_PAGINATION_LIMIT,
        skip: input.skip,
        select: {
          ...getUserDebtsSelect,
        },
      }),
      ctx.prisma.debt.count({
        where: {
          ...((input.status === "archived" || input.status === "active") && {
            archived: input.status === "archived",
          }),
          lenderId: ctx.session.user.id,
          payments:
            input.status === "pending-confirmation"
              ? {
                  some: {
                    status: {
                      equals: PaymentStatus.PENDING_CONFIRMATION,
                    },
                  },
                }
              : undefined,
        },
      }),
    ]);

    return {
      debts,
      count,
    };
  });
