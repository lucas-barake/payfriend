import { protectedVerifiedProcedure } from "$/server/api/trpc";
import { createDebtInput } from "$/server/api/routers/groups/debts/createDebt/input";
import CUSTOM_EXCEPTIONS from "$/server/api/custom-exceptions";

const createDebt = protectedVerifiedProcedure
  .input(createDebtInput)
  .mutation(async ({ ctx, input }) => {
    const exists = await ctx.prisma.group.findFirst({
      where: {
        users: {
          some: {
            userId: input.borrowerId,
            groupId: input.groupId,
            role: {
              in: ["OWNER", "COLLABORATOR"],
            },
          },
        },
      },
      select: {
        id: true,
      },
    });
    if (!exists) throw CUSTOM_EXCEPTIONS.UNAUTHORIZED();

    return ctx.prisma.debt.create({
      data: {
        description: input.description,
        amount: input.amount,
        dueDate: input.dueDate,
        borrowerId: input.borrowerId,
        lenderId: input.lenderId,
        groupId: input.groupId,
      },
    });
  });

export default createDebt;
