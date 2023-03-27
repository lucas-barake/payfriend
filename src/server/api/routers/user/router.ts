import { createTRPCRouter } from "$/server/api/trpc";
import sendOTP from "$/server/api/routers/user/mutations/sendOTP/handler";
import verifyOTP from "$/server/api/routers/user/mutations/verifyOTP/handler";
import {
  getOwnedGroups,
  getSharedGroups,
} from "$/server/api/routers/user/queries/groups/handler";
import getInvites from "$/server/api/routers/user/queries/getInvites/handler";
import sendInvite from "$/server/api/routers/user/mutations/sendInvite/handler";
import acceptInvite from "$/server/api/routers/user/mutations/acceptInvite/handler";
import rejectInvite from "$/server/api/routers/user/mutations/rejectInvite/handler";

const userRouter = createTRPCRouter({
  sendOTP,
  verifyOTP,
  getSharedGroups,
  getOwnedGroups,
  getInvites,
  acceptInvite,
  rejectInvite,
  sendInvite,
});

export default userRouter;
