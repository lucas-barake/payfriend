import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Pages } from "$/lib/enums/pages";

function useRedirectSession(): ReturnType<typeof useSession> {
  const router = useRouter();
  return useSession({
    required: true,
    onUnauthenticated() {
      void router.push(Pages.HOME);
    },
  });
}

export { useRedirectSession };
