import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { type FC, type ReactNode } from "react";
import dynamic from "next/dynamic";
import LoadingPage from "$/components/LoadingPage";

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

  if (session.data?.user.emailVerified == null) {
    void router.push("/auth/verify-email");
    return <LoadingPage />;
  }

  return <>{children}</>;
};

export default dynamic(() => Promise.resolve(AuthWrapper), {
  ssr: false,
});
