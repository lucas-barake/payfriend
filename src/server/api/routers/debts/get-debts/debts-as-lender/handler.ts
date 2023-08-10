import { TRPCProcedures } from "$/server/api/trpc";
import { getUserDebtsSelect } from "$/server/api/routers/debts/get-debts/subrouter";
import { debtsAsLenderInput } from "$/server/api/routers/debts/get-debts/debts-as-lender/input";
import { DEBTS_QUERY_PAGINATION_LIMIT } from "$/server/api/routers/debts/get-debts/(lib)/constants";
import { PaymentStatus, Prisma } from "@prisma/client";
import DebtWhereInput = Prisma.DebtWhereInput;

export const getOwnedDebts = TRPCProcedures.protected
  .input(debtsAsLenderInput)
  .query(async ({ ctx, input }) => {
    const where = {
      ...(input.status === "active" && {
        archived: {
          equals: null,
        },
      }),
      ...(input.status === "archived" && {
        archived: {
          not: {
            equals: null,
          },
        },
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
    } satisfies DebtWhereInput;

    const [debts, count] = await ctx.prisma.$transaction([
      ctx.prisma.debt.findMany({
        where,
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
        where,
      }),
    ]);

    return {
      debts,
      count,
    };
  });
