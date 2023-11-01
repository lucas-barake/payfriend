/* eslint-disable @typescript-eslint/consistent-type-definitions,no-param-reassign */
import { type GetServerSidePropsContext } from "next";
import {
  type DefaultSession,
  getServerSession,
  type NextAuthOptions,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { env } from "$/env.mjs";
import { prisma } from "$/server/db";
import {
  type ActiveSubscription,
  type SubscriptionStatus,
} from "@prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { updateSessionSubscription } from "$/server/auth/update-session-schemas";
import { isInFuture } from "$/lib/utils/time/is-in-future";
import { DateTime } from "luxon";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */

type Subscription = {
  id: ActiveSubscription["id"];
  nextDueDate: string;
  status: SubscriptionStatus;
  isActive: boolean;
};

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      emailVerified: string | null;
      phoneVerified: string | null;
      subscription: Subscription | null;
    } & DefaultSession["user"];
  }

  interface User {
    emailVerified: string | null;
    phoneVerified: string | null;
    subscription: Subscription | null;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    async session({ session, user, trigger, newSession }) {
      if (session.user) {
        session.user.id = user.id;
        // Dates are queried as Date objects from the DB, but are automatically converted to strings when sent to the client.
        // So, we convert them to strings right away to avoid having to do it later.
        session.user.emailVerified = DateTime.fromJSDate(
          user.emailVerified as Date
        )
          .toUTC()
          .toISO();
        session.user.phoneVerified = user.phoneVerified;

        const activeSubscription = await prisma.activeSubscription.findUnique({
          where: {
            userId: user.id,
          },
          select: {
            id: true,
            nextDueDate: true,
            status: true,
          },
        });

        session.user.subscription =
          activeSubscription !== null
            ? {
                id: activeSubscription.id,
                status: activeSubscription.status,
                nextDueDate: DateTime.fromJSDate(
                  activeSubscription.nextDueDate as unknown as Date
                )
                  .toUTC()
                  .toISO(),
                // If the nextDueDate is in the future, it means the subscription is still active
                isActive: isInFuture(
                  activeSubscription.nextDueDate as unknown as Date
                ),
              }
            : null;
      }

      if (trigger === "update" && session.user) {
        const newSessionData = updateSessionSubscription.safeParse(newSession);

        if (newSessionData.success) {
          session.user.subscription = {
            id: session.user.subscription!.id,
            status: "CANCELLED",
            nextDueDate: session.user.subscription!.nextDueDate,
            isActive: isInFuture(
              session.user.subscription!.nextDueDate as unknown as Date
            ),
          };
        }
      }
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Google provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  pages: {
    signIn: "/",
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
