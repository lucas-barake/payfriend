import {
  createTRPCRouter,
  protectedVerifiedProcedure,
} from "$/server/api/trpc";

export const userGroupinvitesQueries = createTRPCRouter({
  getGroupInvites: protectedVerifiedProcedure.query(async ({ ctx }) => {
    const query = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        pendingInvites: {
          select: {
            group: {
              select: {
                id: true,
                name: true,
                users: {
                  where: {
                    role: "OWNER",
                  },
                  include: {
                    user: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const pendingInvites = query?.pendingInvites ?? [];
    return pendingInvites.map((pendingInvite) => ({
      groupId: pendingInvite.group.id,
      groupName: pendingInvite.group.name,
      owner: pendingInvite.group.users[0]?.user.name,
    }));
  }),
});
