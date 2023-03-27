import { protectedVerifiedProcedure } from "$/server/api/trpc";
import { getSettingsInput } from "$/server/api/routers/groups/queries/getSettingsById/input";
import { TRPCError } from "@trpc/server";
import handleMainError from "$/server/log/handleMainError";
import { inviteUserSelect } from "$/server/api/routers/user/mutations/sendInvite/handler";

const getSettingsById = protectedVerifiedProcedure
  .input(getSettingsInput)
  .query(async ({ ctx, input }) => {
    try {
      const settingsQuery = await ctx.prisma.group.findFirst({
        where: {
          id: input.groupId,
          users: {
            some: {
              user: {
                id: ctx.session.user.id,
              },
              role: "OWNER",
            },
          },
        },
        select: {
          name: true,
          description: true,
          users: {
            select: {
              role: true,
              user: {
                select: {
                  id: true,
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
                select: inviteUserSelect,
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

      return {
        name: settingsQuery.name,
        description: settingsQuery.description,
        members: [
          ...settingsQuery.users.map((user) => ({
            ...user.user,
            role: user.role,
            isPending: false,
          })),
          ...settingsQuery.pendingInvites.map((pendingInvite) => ({
            ...pendingInvite.user,
            role: pendingInvite.role,
            isPending: true,
          })),
        ],
      };
    } catch (error) {
      handleMainError(error);
    }
  });

export default getSettingsById;
