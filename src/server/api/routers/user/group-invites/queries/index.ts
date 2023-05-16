import {
  createTRPCRouter,
  protectedVerifiedProcedure,
} from "$/server/api/trpc";

export const userGroupinvitesQueries = createTRPCRouter({
  getDebtsInvites: protectedVerifiedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.user
      .findUnique({
        where: { id: ctx.session.user.id },
      })
      .pendingInvites({
        select: {
          inviter: {
            select: {
              email: true,
              name: true,
            },
          },
          debt: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
  }),
});
