import { env } from "$/env.mjs";
import { APP_NAME } from "$/lib/constants/app-name";
import { type MailDataRequired } from "@sendgrid/mail";
import { logger } from "$/server/logger";
import { type InnerTRPCContext } from "$/server/api/trpc";
import { render } from "@react-email/render";
import type React from "react";
import {
  InvitationEmail,
  type InvitationEmailProps,
} from "$/components/emails";

type CommonArgs = {
  mail: InnerTRPCContext["mail"];
  invitationEmailProps: InvitationEmailProps;
};
type BatchEmailArgs = {
  toEmails: string[];
  multiple: true;
} & CommonArgs;
type SingleEmailArgs = {
  toEmail: string;
  multiple: false;
} & CommonArgs;

type Args = BatchEmailArgs | SingleEmailArgs;

export function sendInvitationEmail(args: Args): void {
  try {
    const emailHtml = render(
      <
        React.ReactElement<
          unknown,
          string | React.JSXElementConstructor<unknown>
        >
      >InvitationEmail(args.invitationEmailProps)
    );

    const msg = {
      to: args.multiple ? args.toEmails : args.toEmail,
      from: env.SENDGRID_FROM_EMAIL,
      subject: `Te invitaron a una deuda en ${APP_NAME}`,
      html: emailHtml,
      mailSettings: {
        sandboxMode: {
          enable: env.SENDGRID_SANDBOX_MODE,
        },
      },
    } satisfies MailDataRequired;

    if (args.multiple) {
      void args.mail.sendMultiple(msg).then(() => {
        logger.info("Invitation emails sent to: ", args.toEmails);
      });
    } else {
      void args.mail.send(msg).then(() => {
        logger.info("Invitation email sent to: ", args.toEmail);
      });
    }
  } catch (err) {
    logger.error(err);
  }
}
