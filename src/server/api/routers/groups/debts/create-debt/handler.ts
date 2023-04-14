import { protectedVerifiedProcedure } from "$/server/api/trpc";
import { createDebtInput } from "$/server/api/routers/groups/debts/create-debt/input";
import CUSTOM_EXCEPTIONS from "$/server/api/custom-exceptions";

const createDebt = protectedVerifiedProcedure
  .input(createDebtInput)
  .mutation(async ({ ctx, input }) => {
    const lenderId = ctx.session.user.id;

    const hasPermission = await ctx.prisma.group.findFirst({
      where: {
        users: {
          some: {
            userId: ctx.session.user.id,
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

    if (!hasPermission) throw CUSTOM_EXCEPTIONS.UNAUTHORIZED();

    const borrowerQuery = await ctx.prisma.user.findFirst({
      where: {
        id: input.borrowerId,
      },
      select: {
        id: true,
      },
    });

    if (!borrowerQuery) {
      throw CUSTOM_EXCEPTIONS.BAD_REQUEST("El usuario no existe");
    }

    return ctx.prisma.debt.create({
      data: {
        description: input.description,
        amount: input.amount,
        dueDate: input.dueDate,
        borrowerId: borrowerQuery.id,
        lenderId,
        groupId: input.groupId,
      },
    });
  });

export default createDebt;
