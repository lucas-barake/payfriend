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
    <header className="fixed top-0 z-10 w-full">
      <div className="flex h-16 items-center justify-between border-b border-border bg-background px-5 py-3 lg:px-16 lg:py-4">
        <Link href={Pages.DASHBOARD} className="text-lg font-bold lg:text-xl">
          {APP_NAME}
        </Link>

        <div className="flex items-baseline gap-2">
          {isAuthenticated && <UserMenu />}

          <ThemeSwitch />
        </div>
      </div>
    </header>
  );
};

export { UserHeader };
