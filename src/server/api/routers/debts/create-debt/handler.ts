import { TRPCProcedures } from "$/server/api/trpc";
import { createDebtInput } from "$/server/api/routers/debts/create-debt/input";
import CUSTOM_EXCEPTIONS from "$/server/api/custom-exceptions";
import { getUserDebtsSelect } from "$/server/api/routers/debts/get-debts/subrouter";
import { checkDebtLimitAndIncr } from "$/server/api/routers/debts/(lib)/utils/check-debt-limit-and-incr";
import { sendInvitationEmail } from "$/server/api/routers/debts/(lib)/utils/send-invitation-email";
import { checkAndMarkEmailSent } from "$/server/api/routers/debts/(lib)/utils/check-and-mark-email-sent";
import { addRecentEmail } from "$/server/api/routers/debts/(lib)/utils/stored-recent-emails";

export const createDebt = TRPCProcedures.protectedLimited
  .input(createDebtInput)
  .mutation(async ({ ctx, input }) => {
    if (
      input.borrowerEmails.some((email) => email === ctx.session.user.email)
    ) {
      throw CUSTOM_EXCEPTIONS.BAD_REQUEST("No puedes prestarte a ti mismo");
    }

    await checkDebtLimitAndIncr(ctx);

    const unsentEmails: string[] = [];
    for (const email of input.borrowerEmails) {
      const emailAlreadySent = await checkAndMarkEmailSent(email);

      if (!emailAlreadySent) {
        unsentEmails.push(email);
      }

      void addRecentEmail({
        email,
        inviterId: ctx.session.user.id,
      });
    }

    return ctx.prisma.$transaction(async (prisma) => {
      const createdDebt = await prisma.debt.create({
        data: {
          name: input.generalInfo.name,
          description: input.generalInfo.description,
          currency: input.generalInfo.currency,
          lender: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          amount: input.generalInfo.amount,
          dueDate: input.generalInfo.dueDate,
          recurringFrequency: input.generalInfo.recurrency?.frequency,
          duration: input.generalInfo.recurrency?.duration,
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

      if (unsentEmails.length > 0) {
        sendInvitationEmail({
          multiple: true,
          toEmails: unsentEmails,
          mail: ctx.mail,
          invitationEmailProps: {
            inviterEmail: ctx.session.user.email,
            inviterName: ctx.session.user.name,
            debtName: input.generalInfo.name,
          },
        });
      }

      return createdDebt;
    });
  });
