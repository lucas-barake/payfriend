import React from "react";
import { useTheme } from "next-themes";
import { Button, type ButtonProps } from "$/components/ui/button";
import * as RadixIcons from "@radix-ui/react-icons";
import * as LucideIcons from "lucide-react";
import dynamic from "next/dynamic";
import { DropdownMenu } from "$/components/ui/dropdown-menu";

type Theme = "light" | "dark" | "system";
type ThemeItemProps = {
  setTheme: (theme: Theme) => void;
  theme: Theme;
  currentTheme: Theme;
  label: string;
};
const ThemeItem: React.FC<ThemeItemProps> = ({
  theme,
  setTheme,
  currentTheme,
  label,
}) => (
  <DropdownMenu.Item
    onClick={() => {
      setTheme(theme);
    }}
  >
    {currentTheme === theme && (
      <LucideIcons.CheckIcon className="mr-1 h-[1rem] w-[1rem]" />
    )}
    {label}
  </DropdownMenu.Item>
);

type Props = {
  variant?: ButtonProps["variant"];
};

const themes = [
  {
    theme: "light",
    label: "Claro",
  },
  {
    theme: "dark",
    label: "Oscuro",
  },
  {
    theme: "system",
    label: "Sistema",
  },
] as const satisfies ReadonlyArray<{
  theme: Theme;
  label: string;
}>;
const BaseTheme: React.FC<Props> = ({ variant = "ghost" }) => {
  const themeConfig = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button variant={variant} size="icon">
          <RadixIcons.SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
          <RadixIcons.MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Cambiar tema</span>
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content align="end">
        {themes.map((theme) => (
          <ThemeItem
            key={theme.theme}
            theme={theme.theme}
            setTheme={themeConfig.setTheme}
            currentTheme={themeConfig.theme as Theme}
            label={theme.label}
          />
        ))}
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};

const ThemeSwitch = dynamic(() => Promise.resolve(BaseTheme), {
  ssr: false,
});

export { ThemeSwitch };
