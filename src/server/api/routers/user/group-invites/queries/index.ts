import {
  createTRPCRouter,
  protectedVerifiedProcedure,
} from "$/server/api/trpc";

export const userGroupinvitesQueries = createTRPCRouter({
  getDebtsInvites: protectedVerifiedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.pendingInvite.findMany({
      where: {
        inviteeEmail: ctx.session.user.email,
      },
      select: {
        debt: {
          select: {
            id: true,
            name: true,
            amount: true,
            lender: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }),
});
