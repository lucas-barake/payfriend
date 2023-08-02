import { TRPCProcedures } from "$/server/api/trpc";
import { createDebtInput } from "$/server/api/routers/debts/mutations/handlers/create/input";
import CUSTOM_EXCEPTIONS from "$/server/api/custom-exceptions";
import { env } from "$/env.mjs";
import { APP_NAME } from "$/lib/constants/app-name";
import { type MailDataRequired } from "@sendgrid/mail";
import { logger } from "$/server/logger";
import { getUserDebtsSelect } from "$/server/api/routers/debts/queries";
import { checkDebtLimitAndIncr } from "$/server/api/routers/debts/mutations/lib/utils/check-debt-limit-and-incr";
import { render } from "@react-email/render";
import type React from "react";
import { InvitationEmail } from "$/components/emails";

export const create = TRPCProcedures.protectedLimited
  .input(createDebtInput)
  .mutation(async ({ ctx, input }) => {
    if (
      input.borrowerEmails.some((email) => email === ctx.session.user.email)
    ) {
      throw CUSTOM_EXCEPTIONS.BAD_REQUEST("No puedes prestarte a ti mismo");
    }

    await checkDebtLimitAndIncr(ctx);

    for (const email of input.borrowerEmails) {
      try {
        const emailHtml = render(
          <
            React.ReactElement<
              unknown,
              string | React.JSXElementConstructor<unknown>
            >
          >InvitationEmail({
            inviteeEmail: email,
            inviterName: ctx.session.user.name,
            inviterEmail: ctx.session.user.email,
            debtName: null,
          })
        );

        const msg = {
          to: email,
          from: env.SENDGRID_FROM_EMAIL,
          subject: `Te invitaron a una deuda en ${APP_NAME}`,
          html: emailHtml,
          mailSettings: {
            sandboxMode: {
              enable: env.SENDGRID_SANDBOX_MODE,
            },
          },
        } satisfies MailDataRequired;

        if (env.SENDGRID_SANDBOX_MODE) {
          logger.info(`Email sent to ${email}`);
        }

        void ctx.mail.send(msg);
      } catch (err) {
        logger.error(err);
      }
    }

    return ctx.prisma.$transaction(async (prisma) => {
      const createdDebt = await prisma.debt.create({
        data: {
          name: input.name,
          description: input.description,
          lender: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          amount: input.amount,
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

      return createdDebt;
    });
  });
