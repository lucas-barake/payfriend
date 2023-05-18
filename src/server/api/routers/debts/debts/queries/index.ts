import {
  createTRPCRouter,
  protectedVerifiedProcedure,
} from "$/server/api/trpc";
import {
  getGroupByIdInput,
  getSettingsInput,
} from "$/server/api/routers/debts/debts/queries/input";
import { inviteUserSelect } from "$/server/api/routers/user/group-invites/mutations/select";
import CUSTOM_EXCEPTIONS from "$/server/api/custom-exceptions";

export const debtsRouter = createTRPCRouter({
  getSettingsById: protectedVerifiedProcedure
    .input(getSettingsInput)
    .query(async ({ ctx, input }) => {
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
        throw CUSTOM_EXCEPTIONS.BAD_REQUEST("No se encontró el grupo");
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
    }),
  getGroupById: protectedVerifiedProcedure
    .input(getGroupByIdInput)
    .query(async ({ ctx, input }) => {
      const query = await ctx.prisma.group.findFirst({
        where: {
          id: input.id,
          users: {
            some: {
              userId: ctx.session.user.id,
            },
          },
        },
        include: {
          users: {
            select: {
              userId: true,
              role: true,
            },
          },
        },
      });

      if (!query) throw CUSTOM_EXCEPTIONS.UNAUTHORIZED();

      return query;
    }),
});
