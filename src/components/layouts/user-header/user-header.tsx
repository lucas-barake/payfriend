import React from "react";
import { useSession } from "next-auth/react";
import UserMenu from "$/components/layouts/user-header/user-menu";
import Link from "next/link";
import { ThemeSwitch } from "$/components/common/theme-switch";
import { Pages } from "$/lib/enums/pages";
import { APP_NAME } from "$/lib/constants/app-name";

const UserHeader: React.FC = () => {
  const session = useSession();
  const isAuthenticated = session.status === "authenticated";

  return (
    <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b bg-background/95 px-5 py-3 shadow-sm backdrop-blur lg:px-16 lg:py-4">
      <Link href={Pages.DASHBOARD} className="text-lg font-bold lg:text-xl">
        {APP_NAME}
      </Link>

      <div className="flex items-center gap-2">
        {isAuthenticated && <UserMenu />}

        <ThemeSwitch />
      </div>
    </header>
  );
};

export { UserHeader };
