import { type FC, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { Button } from "$/components/ui/button";
import UserMenu from "src/layouts/user-header/user-menu";
import Link from "next/link";
import { Moon, Sun } from "lucide-react";

const UserHeader: FC = () => {
  const session = useSession();
  const isAuthenticated = session.status === "authenticated";
  const theme = useTheme();
  const currentTheme = useMemo(
    () => (theme.theme === "system" ? theme.systemTheme : theme.theme),
    [theme.theme, theme.systemTheme]
  );

  return (
    <header className="fixed top-0 z-10 w-full">
      <div className="flex h-16 items-center justify-between border-b border-border bg-background px-5 py-3 lg:px-16 lg:py-4">
        <Link href="/dashboard" className="text-lg font-bold lg:text-xl">
          deudamigo
        </Link>

        <div className="flex items-baseline gap-2">
          {isAuthenticated && <UserMenu />}

          {currentTheme === "dark" ? (
            <Button
              variant="ghost"
              onClick={() => {
                theme.setTheme("light");
              }}
              className="active:translate-y-0.5"
              size="sm"
            >
              <Sun className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              className="active:translate-y-0.5"
              onClick={() => {
                theme.setTheme("dark");
              }}
              size="sm"
            >
              <Moon className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export { UserHeader };
