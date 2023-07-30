/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { type GetServerSidePropsContext } from "next";
import {
  type DefaultSession,
  getServerSession,
  type NextAuthOptions,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { env } from "$/env.mjs";
import { prisma } from "$/server/db";
import { type ActiveSubscription } from "@prisma/client";
import { ModifiedPrismaAdapter } from "$/server/modified-prisma-adapter";
import { z } from "zod";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
      emailVerified: Date | null;
      phoneVerified: Date | null;
      activeSubscription: ActiveSubscription | null;
    } & DefaultSession["user"];
  }

  interface User {
    emailVerified: Date | null;
    phoneVerified: Date | null;
    activeSubscription: ActiveSubscription | null;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, user, trigger, newSession }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.emailVerified = user.emailVerified;
        session.user.phoneVerified = user.phoneVerified;
        session.user.activeSubscription = user.activeSubscription;
        // session.user.role = user.role; <-- put other properties on the session here
      }

      if (trigger === "update" && session.user) {
        const updatedSession = z.object({
          activeSubscription: z.null(),
        });

        const newSessionData = updatedSession.safeParse(newSession);
        console.log(newSessionData);

        if (newSessionData.success) {
          session.user.activeSubscription = null;
        }
      }
      return session;
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  adapter: ModifiedPrismaAdapter(prisma),
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
    signIn: "/auth/signin",
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
