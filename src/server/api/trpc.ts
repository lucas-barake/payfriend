import Twilio from "twilio";
import { env } from "$/env.mjs";
import sendGridMail from "@sendgrid/mail";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 */
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { type Session } from "next-auth";

import { getServerAuthSession } from "$/server/auth/auth";
import { prisma } from "$/server/db";
/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import mercadopago from "$/server/api/routers/subscription-plans/(lib)/mercadopago";
import { redis } from "$/server/redis";
import { type RateLimitConfig } from "$/server/api/utils/rate-limit/types";
import { rateLimit } from "$/server/api/utils/rate-limit";

type CreateContextOptions = {
  session: Session | null;
};

/**
 * This helper generates the "internals" for a tRPC context. If you need to use it, you can export
 * it from here.
 *
 * Examples of things you may need it for:
 * - testing, so we don't have to mock Next.js' req/res
 * - tRPC's `createSSGHelpers`, where we don't have req/res
 *
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 */
const createInnerTRPCContext = (opts: CreateContextOptions) => {
  const twilio = Twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
  const mail = sendGridMail;
  mail.setApiKey(env.SENDGRID_API_KEY);

  return {
    session: opts.session,
    prisma,
    redis,
    twilio,
    mail,
    mercadopago,
  };
};
export type InnerTRPCContext = ReturnType<typeof createInnerTRPCContext>;

/**
 * This is the actual context you will use in your router. It will be used to process every request
 * that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/context
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  // Get the session from the server using the getServerSession wrapper function
  const session = await getServerAuthSession({ req, res });

  return createInnerTRPCContext({
    session,
  });
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    if (error.code === "INTERNAL_SERVER_ERROR") {
      return {
        ...shape,
        message: "Error interno del servidor. Por favor, inténtelo de nuevo.",
      };
    }
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;
export const mergeTRPCRouters = t.mergeRouters;
export const createTRPCMiddleware = t.middleware;

/** Reusable middleware that enforces users are logged in before running the procedure. */
const enforceUserIsAuthed = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user?.email) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  // TypeScript can't infer that `email` is non-nullable, so we have to do this
  const user = {
    ...ctx.session.user,
    email: ctx.session.user.email,
  };

  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user },
    },
  });
});

const enforceUserIsVerified = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user?.email) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  if (ctx.session.user.phoneVerified === null) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "UNVERIFIED_PHONE",
    });
  }

  // TypeScript can't infer that `email` is non-nullable, so we have to do this
  const user = {
    ...ctx.session.user,
    email: ctx.session.user.email,
  };

  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user },
    },
  });
});

export const TRPCProcedures = {
  public: t.procedure,
  protected: t.procedure.use(enforceUserIsAuthed),
  verified: t.procedure.use(enforceUserIsVerified),
  rateLimited: (config: RateLimitConfig) =>
    t.procedure.use(
      enforceUserIsAuthed.unstable_pipe(async ({ ctx, next }) => {
        await rateLimit(
          {
            redis: ctx.redis,
            session: ctx.session,
          },
          config
        );

        return next({
          ctx,
        });
      })
    ),
};
