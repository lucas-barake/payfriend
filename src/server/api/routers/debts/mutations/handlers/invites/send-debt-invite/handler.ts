import { TRPCProcedures } from "$/server/api/trpc";
import { sendDebtInviteInput } from "$/server/api/routers/debts/mutations/handlers/invites/send-debt-invite/input";
import CUSTOM_EXCEPTIONS from "$/server/api/custom-exceptions";
import { Prisma } from "@prisma/client";
import { checkAndMarkEmailSent } from "$/server/api/routers/debts/mutations/lib/utils/check-and-mark-email-sent";
import { sendInvitationEmail } from "$/server/api/routers/debts/mutations/lib/utils/send-invitation-email";
import { addRecentEmail } from "$/server/api/routers/debts/mutations/lib/utils/stored-recent-emails";
import { MAX_BORROWERS } from "$/server/api/routers/debts/mutations/handlers/create-debt/input";

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

    if (totalCount >= MAX_BORROWERS) {
      throw CUSTOM_EXCEPTIONS.BAD_REQUEST(
        "El grupo ya tiene el máximo de usuarios"
      );
    }

    void checkAndMarkEmailSent(input.email).then((emailAlreadySent) => {
      if (emailAlreadySent) return;

      sendInvitationEmail({
        mail: ctx.mail,
        toEmail: input.email,
        multiple: false,
        invitationEmailProps: {
          inviteeEmail: input.email,
          inviterEmail: ctx.session.user.email,
          inviterName: ctx.session.user.name,
          debtName: debt.name,
        },
      });
    });

    void addRecentEmail({
      email: input.email,
      inviterId: ctx.session.user.id,
    });

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
