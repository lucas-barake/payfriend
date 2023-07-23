import { createTRPCRouter, TRPCProcedures } from "$/server/api/trpc";

export const debtInvitesQueriesRouter = createTRPCRouter({
  getDebtsInvites: TRPCProcedures.verified.query(async ({ ctx }) => {
    return ctx.prisma.pendingInvite.findMany({
      where: {
        inviteeEmail: ctx.session.user.email,
      },
      select: {
        debt: {
          select: {
            id: true,
            name: true,
            description: true,
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
