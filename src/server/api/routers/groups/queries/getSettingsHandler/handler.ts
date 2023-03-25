import { protectedVerifiedProcedure } from "$/server/api/trpc";
import { getSettingsInput } from "$/server/api/routers/groups/queries/getSettingsHandler/input";
import { TRPCError } from "@trpc/server";
import handleMainError from "$/server/log/handleMainError";

const getSettingsHandler = protectedVerifiedProcedure
  .input(getSettingsInput)
  .query(async ({ ctx, input }) => {
    try {
      const settingsQuery = await ctx.prisma.debtTable.findFirst({
        where: {
          id: input.groupId,
          collaborators: {
            some: {
              collaborator: {
                id: ctx.session.user.id,
              },
              role: "OWNER",
            },
          },
        },
        select: {
          name: true,
          description: true,
          collaborators: {
            select: {
              role: true,
              collaborator: {
                select: {
                  name: true,
                  image: true,
                  email: true,
                },
              },
            },
          },
          pendingInvites: {
            select: {
              role: true,
              user: {
                select: {
                  name: true,
                  image: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      if (!settingsQuery) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "No se encontró el grupo",
        });
      }

      return settingsQuery;
    } catch (error) {
      handleMainError(error);
    }
  });

export default getSettingsHandler;
