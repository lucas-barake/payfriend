import React, { type FC, type ReactNode } from "react";
import dynamic from "next/dynamic";
import LoadingPage from "$/components/pages/loading-page";
import { useRedirectSession } from "$/hooks/use-redirect-session";
import { api } from "$/lib/utils/api";

type Props = {
  children: ReactNode;
};

// Setting enabled to false does not allow invalidation of the query for some reason, so we have to use this workaround
const FreePlanDebtLimitCount: React.FC = () => {
  api.user.getFreePlanDebtLimitCount.useQuery(undefined, {
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    retry: 2,
  });
  return null;
};

const AuthWrapper: FC<Props> = ({ children }) => {
  const session = useRedirectSession();

  if (session.status === "loading") return <LoadingPage />;
  const hasActiveSubscription =
    session.data?.user.subscription?.isActive ?? false;

  return (
    <React.Fragment>
      {!hasActiveSubscription && <FreePlanDebtLimitCount />}
      {children}
    </React.Fragment>
  );
};

const ClientSideAuthWrapper = dynamic(() => Promise.resolve(AuthWrapper), {
  ssr: false,
});

export { ClientSideAuthWrapper as AuthWrapper };
