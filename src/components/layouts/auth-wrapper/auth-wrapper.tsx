import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { type FC, type ReactNode } from "react";
import dynamic from "next/dynamic";
import LoadingPage from "$/components/pages/loading-page";

type Props = {
  children: ReactNode;
};

const AuthWrapper: FC<Props> = ({ children }) => {
  const router = useRouter();
  const session = useSession({
    required: true,
    onUnauthenticated() {
      void router.push("/");
    },
  });

  if (session.status === "loading") return <LoadingPage />;

  if (session.data?.user.emailVerified === null) {
    void router.push("/auth/verify-email");
    return <LoadingPage />;
  }

  return <>{children}</>;
};

const ClientSideAuthWrapper = dynamic(() => Promise.resolve(AuthWrapper), {
  ssr: false,
});

export { ClientSideAuthWrapper as AuthWrapper };
