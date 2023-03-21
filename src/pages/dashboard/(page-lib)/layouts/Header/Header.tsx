import { type FC, useMemo } from "react";
import { useSession } from "next-auth/react";
import { MoonIcon, SunIcon } from "@heroicons/react/outline";
import { useTheme } from "next-themes";
import Button from "$/components/Button";
import UserMenu from "$/pages/dashboard/(page-lib)/layouts/Header/UserMenu";

const Header: FC = () => {
  const session = useSession();
  const isAuthenticated = session.status === "authenticated";
  const theme = useTheme();
  const currentTheme = useMemo(
    () => (theme.theme === "system" ? theme.systemTheme : theme.theme),
    [theme.theme, theme.systemTheme]
  );

  return (
    <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-5 py-3 dark:border-b-neutral-700 dark:bg-neutral-800 lg:px-16 lg:py-4">
      <h1 className="text-xl font-bold lg:text-2xl">deudamigo</h1>

      <div className="flex items-baseline gap-2">
        {isAuthenticated && <UserMenu />}

        {currentTheme === "dark" ? (
          <Button
            color="neutral"
            onClick={() => {
              theme.setTheme("light");
            }}
            className="rounded-md active:translate-y-0.5"
          >
            <SunIcon className="h-5 w-5" />
          </Button>
        ) : (
          <Button
            className="rounded-md bg-indigo-100/40 shadow-none hover:shadow-none active:translate-y-0.5"
            onClick={() => {
              theme.setTheme("dark");
            }}
          >
            <MoonIcon className="h-5 w-5 stroke-2 text-indigo-600" />
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
