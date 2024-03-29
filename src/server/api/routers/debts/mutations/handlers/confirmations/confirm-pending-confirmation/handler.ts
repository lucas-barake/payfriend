import { TRPCProcedures } from "$/server/api/trpc";
import { z } from "zod";
import CUSTOM_EXCEPTIONS from "$/server/api/custom-exceptions";
import { BorrowerStatus } from "@prisma/client";

export const confirmPendingConfirmation = TRPCProcedures.protected
  .input(
    z.object({
      debtId: z.string().uuid(),
      userId: z.string().uuid(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const debt = await ctx.prisma.debt.findFirst({
      where: {
        id: input.debtId,
        lenderId: ctx.session.user.id,
        archived: false,
      },
      select: {
        id: true,
        borrowers: {
          select: {
            id: true,
            status: true,
            user: {
              select: {
                id: true,
              },
            },
          },
        },
        pendingInvites: {
          select: {
            inviteeEmail: true,
          },
        },
      },
    });

    if (!debt) {
      throw CUSTOM_EXCEPTIONS.NOT_FOUND("Deuda no encontrada");
    }

    const borrower = debt.borrowers.find(
      (borrower) => borrower.user.id === input.userId
    );

    if (!borrower) {
      throw CUSTOM_EXCEPTIONS.NOT_FOUND("Usuario no encontrado");
    }

    if (borrower.status !== "PENDING_CONFIRMATION") {
      throw CUSTOM_EXCEPTIONS.BAD_REQUEST(
        "El usuario no está pendiente de confirmación"
      );
    }

    const updatedBorrower = await ctx.prisma.borrower.update({
      where: {
        id: borrower.id,
      },
      data: {
        status: BorrowerStatus.CONFIRMED,
      },
    });

    const allConfirmed = debt.borrowers
      .map((borrower) =>
        borrower.id === updatedBorrower.id ? updatedBorrower : borrower
      )
      .every((borrower) => borrower.status === BorrowerStatus.CONFIRMED);

    if (allConfirmed && debt.pendingInvites.length === 0) {
      await ctx.prisma.debt.update({
        where: {
          id: debt.id,
        },
        data: {
          archived: true,
        },
      });
    }

    return updatedBorrower;
  });
