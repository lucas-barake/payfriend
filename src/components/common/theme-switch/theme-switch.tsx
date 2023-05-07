import React from "react";
import { useTheme } from "next-themes";
import { Button, type ButtonProps } from "$/components/ui/button";
import { Moon, Sun } from "lucide-react";

type Props = {
  variant?: ButtonProps["variant"];
};

const ThemeSwitch: React.FC<Props> = ({ variant = "ghost" }) => {
  const theme = useTheme();
  const currentTheme = React.useMemo(
    () => (theme.theme === "system" ? theme.systemTheme : theme.theme),
    [theme.theme, theme.systemTheme]
  );

  return (
    <Button
      variant={variant}
      onClick={() => {
        if (currentTheme === "dark") {
          theme.setTheme("light");
        } else {
          theme.setTheme("dark");
        }
      }}
      size="sm"
    >
      {currentTheme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
};

export { ThemeSwitch };
