import { TRPCProcedures } from "$/server/api/trpc";
import { getUserDebtsSelect } from "$/server/api/routers/debts/queries";
import { BorrowerStatus } from "@prisma/client";
import { lenderDebtsQueryInput } from "$/server/api/routers/debts/queries/handlers/get-owned-debts/input";

export const getOwnedDebts = TRPCProcedures.protected
  .input(lenderDebtsQueryInput)
  .query(async ({ ctx, input }) => {
    const [debts, count] = await ctx.prisma.$transaction([
      ctx.prisma.debt.findMany({
        where: {
          ...((input.status === "archived" || input.status === "active") && {
            archived: input.status === "archived",
          }),
          lenderId: ctx.session.user.id,
          borrowers:
            input.status === "pending-confirmation"
              ? {
                  some: {
                    status: {
                      equals: BorrowerStatus.PENDING_CONFIRMATION,
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
        take: input.limit ?? 8,
        skip: input.skip,
        select: {
          ...getUserDebtsSelect,
        },
      }),
      ctx.prisma.debt.count({
        where: {
          archived:
            input.status === "all" ? undefined : input.status !== "active",
          lenderId: ctx.session.user.id,
          borrowers: {
            some: {
              status: {
                equals:
                  input.status === "pending-confirmation"
                    ? BorrowerStatus.PENDING_CONFIRMATION
                    : undefined,
              },
            },
          },
        },
      }),
    ]);

    return {
      debts,
      count,
    };
  });
