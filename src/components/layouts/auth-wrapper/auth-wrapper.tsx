import { useRouter } from "next/router";
import { type FC, type ReactNode } from "react";
import dynamic from "next/dynamic";
import LoadingPage from "$/components/pages/loading-page";
import { Pages } from "$/lib/enums/pages";
import { useRedirectSession } from "$/hooks/use-redirect-session";

type Props = {
  children: ReactNode;
};

const AuthWrapper: FC<Props> = ({ children }) => {
  const router = useRouter();
  const session = useRedirectSession();

  if (session.status === "loading") return <LoadingPage />;

  if (session.data?.user.emailVerified === null) {
    void router.push(Pages.ONBOARDING);
    return <LoadingPage />;
  }

  return <>{children}</>;
};

const ClientSideAuthWrapper = dynamic(() => Promise.resolve(AuthWrapper), {
  ssr: false,
});

export { ClientSideAuthWrapper as AuthWrapper };
