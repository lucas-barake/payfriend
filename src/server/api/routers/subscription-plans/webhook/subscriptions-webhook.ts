import { type NextApiRequest, type NextApiResponse } from "next";
import { z } from "zod";
import { env } from "$/env.mjs";
import {
  type GetSubscriptionResponse,
  type SubscriptionId,
  type UserId,
} from "$/server/api/routers/subscription-plans/(lib)/types/subscriptions";
import { logger } from "$/server/logger";
import { prisma } from "$/server/db";
import { Prisma, SubscriptionType } from "@prisma/client";
import { DateTime } from "luxon";

export async function subscriptionsWebhook(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const body = z
      .object({
        type: z.union([
          z.literal("subscription_preapproval"),
          z.literal("subscription_authorized_payment"),
        ]),
        data: z.object({ id: z.string() }),
      })
      .passthrough()
      .parse(req.body);
    logger.dev("SUBSCRIPTIONS WEBHOOK BODY", body);

    if (body.type === "subscription_authorized_payment") {
      logger.info("Authorized Payment Invoice", body.data.id);
      res.status(200).end();
      return;
    }

    const getSubscriptionRes = await fetch(
      `${env.MERCADOPAGO_URL}/preapproval/${body.data.id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${env.MERCADOPAGO_ACCESS_TOKEN}`,
        },
      }
    );

    const json = (await getSubscriptionRes.json()) as GetSubscriptionResponse;
    logger.dev("SUBSCRIPTIONS WEBHOOK GET SUBSCRIPTION", json);

    const _cuid2 = json.external_reference.split(":")[0];
    const userId = json.external_reference.split(":")[1] as UserId;
    const subscriptionType = json.external_reference.split(
      ":"
    )[2] as SubscriptionId;

    switch (json.status) {
      case "paused":
        await prisma.subscriptionHistory.update({
          where: {
            id: json.id,
          },
          data: {
            status: "FAILED",
          },
        });
        logger.info(`Paused subscription ${json.id}`);
        break;

      case "pending":
        await prisma.subscriptionHistory.create({
          data: {
            id: json.id,
            userId,
            type: SubscriptionType[subscriptionType],
            status: "PENDING",
            externalReference: json.external_reference,
            nextDueDate: DateTime.fromISO(json.date_created)
              .plus({
                months: 1,
              })
              .toISO(),
          },
        });
        logger.info(`Added pending subscription ${json.id}`);
        break;

      case "authorized":
        await prisma.$transaction(async (prisma) => {
          await prisma.activeSubscription.upsert({
            where: {
              userId,
            },
            create: {
              id: json.id,
              userId,
              type: SubscriptionType[subscriptionType],
              externalReference: json.external_reference,
              nextDueDate: DateTime.fromISO(json.last_modified)
                .plus({
                  months: 1,
                })
                .toISO(),
              status: "SUCCESS",
            },
            update: {
              id: json.id,
              type: SubscriptionType[subscriptionType],
              externalReference: json.external_reference,
              nextDueDate: DateTime.fromISO(json.last_modified)
                .plus({
                  months: 1,
                })
                .toISO(),
              status: "SUCCESS",
            },
          });

          await prisma.subscriptionHistory.upsert({
            where: {
              id: json.id,
            },
            create: {
              status: "SUCCESS",
              type: SubscriptionType[subscriptionType],
              userId,
              nextDueDate: DateTime.fromISO(json.last_modified)
                .plus({
                  months: 1,
                })
                .toISO(),
              externalReference: json.external_reference,
              id: json.id,
            },
            update: {
              status: "SUCCESS",
            },
          });
        });
        logger.info(`Authorized subscription ${json.id}`);
        break;
      case "cancelled":
        await prisma.$transaction(async (prisma) => {
          await prisma.activeSubscription.update({
            where: {
              userId,
            },
            data: {
              status: "CANCELLED",
            },
          });

          await prisma.subscriptionHistory.update({
            where: {
              id: json.id,
            },
            data: {
              status: "CANCELLED",
            },
          });
        });
        logger.info(`Cancelled subscription ${json.id}`);
    }

    res.status(200).send("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.error("ZOD", error.errors, "BODY", req.body);
      res.status(400).send("BAD REQUEST");
      return;
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      logger.error(error.name, {
        message: JSON.stringify(error.message),
        code: error.code,
        meta: error.meta,
        cause: error.cause,
      });
      res.status(400).send("BAD REQUEST");
      return;
    }
    if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      logger.error(error.name, {
        message: JSON.stringify(error.message),
        cause: error.cause,
      });
      res.status(400).send("BAD REQUEST");
      return;
    }
    logger.error("UNKNOWN ERROR", error);
    res.status(500).send("ERROR");
  }
}
