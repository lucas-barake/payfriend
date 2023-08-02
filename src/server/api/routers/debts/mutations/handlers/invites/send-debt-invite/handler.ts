import { TRPCProcedures } from "$/server/api/trpc";
import { sendDebtInviteInput } from "$/server/api/routers/debts/mutations/handlers/invites/send-debt-invite/input";
import CUSTOM_EXCEPTIONS from "$/server/api/custom-exceptions";
import { MAX_NUM_OF_GROUP_USERS } from "$/server/api/routers/user/restrictions";
import { env } from "$/env.mjs";
import { APP_NAME } from "$/lib/constants/app-name";
import { type MailDataRequired } from "@sendgrid/mail";
import { logger } from "$/server/logger";
import { Prisma } from "@prisma/client";
import { render } from "@react-email/render";
import { InvitationEmail } from "$/components/emails";
import type React from "react";

export const sendDebtInvite = TRPCProcedures.protectedLimited
  .input(sendDebtInviteInput)
  .mutation(async ({ ctx, input }) => {
    const debt = await ctx.prisma.debt.findFirst({
      where: {
        id: input.debtId,
        lenderId: ctx.session.user.id,
        archived: false,
      },
      select: {
        name: true,
        borrowers: {
          select: {
            id: true,
            user: {
              select: {
                email: true,
              },
            },
          },
        },
        pendingInvites: {
          select: {
            debtId: true,
          },
        },
      },
    });

    if (!debt) {
      throw CUSTOM_EXCEPTIONS.UNAUTHORIZED();
    }

    if (ctx.session.user.email === input.email) {
      throw CUSTOM_EXCEPTIONS.BAD_REQUEST("No puedes invitarte a ti mismo");
    }

    if (
      debt.borrowers.some((borrower) => borrower.user.email === input.email)
    ) {
      throw CUSTOM_EXCEPTIONS.BAD_REQUEST("El usuario ya está en el grupo");
    }

    const totalCount = debt.borrowers.length + debt.pendingInvites.length;

    if (totalCount >= MAX_NUM_OF_GROUP_USERS) {
      throw CUSTOM_EXCEPTIONS.BAD_REQUEST(
        "El grupo ya tiene el máximo de usuarios"
      );
    }

    try {
      const emailHtml = render(
        <
          React.ReactElement<
            unknown,
            string | React.JSXElementConstructor<unknown>
          >
        >InvitationEmail({
          inviteeEmail: input.email,
          inviterName: ctx.session.user.name,
          inviterEmail: ctx.session.user.email,
          debtName: debt.name,
        })
      );

      const msg = {
        to: input.email,
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
        logger.info(`Email sent to ${input.email}`);
      }

      void ctx.mail.send(msg);
    } catch (err) {
      logger.error(err);
    }

    try {
      return await ctx.prisma.pendingInvite.create({
        data: {
          debt: {
            connect: {
              id: input.debtId,
            },
          },
          inviteeEmail: input.email,
          inviter: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
        select: {
          inviteeEmail: true,
          debt: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw CUSTOM_EXCEPTIONS.BAD_REQUEST("El usuario ya está invitado");
        }
      }
      throw error;
    }
  });
