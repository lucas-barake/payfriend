import { TRPCProcedures } from "$/server/api/trpc";
import CUSTOM_EXCEPTIONS from "$/server/api/custom-exceptions";
import { addPaymentInput } from "$/server/api/routers/debts/payments/add-payment/input";
import { PaymentStatus } from "@prisma/client";

export const addPaymentHandler = TRPCProcedures.protected
  .input(addPaymentInput)
  .mutation(async ({ ctx, input }) => {
    console.log(input, ctx.session.user.id);
    const debt = await ctx.prisma.debt.findFirst({
      where: {
        id: input.debtId,
        borrowers: {
          some: {
            userId: ctx.session.user.id,
          },
        },
        archived: false,
      },
      select: {
        id: true,
        amount: true,
        borrowers: {
          select: {
            balance: true,
            userId: true,
            debtId: true,
          },
        },
      },
    });

    if (!debt) {
      throw CUSTOM_EXCEPTIONS.BAD_REQUEST("No se encontró la deuda");
    }

    const borrower = debt.borrowers.find(
      (borrower) => borrower.userId === ctx.session.user.id
    );

    if (!borrower) {
      throw CUSTOM_EXCEPTIONS.BAD_REQUEST("No se encontró el deudor");
    }

    if (borrower.balance === 0) {
      throw CUSTOM_EXCEPTIONS.BAD_REQUEST("Ya se ha pagado la deuda");
    }

    const amount = input.fullPayment ? borrower.balance : input.amount;

    if (amount > borrower.balance) {
      throw CUSTOM_EXCEPTIONS.BAD_REQUEST(
        "No se puede pagar más de lo que se debe"
      );
    }

    const newBalance = borrower.balance - amount;

    await ctx.prisma.$transaction(async (prisma) => {
      await prisma.payment.create({
        data: {
          amount,
          debtId: debt.id,
          borrowerId: borrower.userId,
          status: PaymentStatus.PENDING_CONFIRMATION,
        },
      });

      await prisma.borrower.update({
        where: {
          userId_debtId: {
            userId: borrower.userId,
            debtId: debt.id,
          },
        },
        data: {
          balance: newBalance,
        },
      });
    });

    return true;
  });
