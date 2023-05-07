import { type ComponentPropsWithoutRef, type FC } from "react";
import cn from "$/lib/utils/cn";

type LayoutProps = ComponentPropsWithoutRef<"main">;

const Layout: FC<LayoutProps> = ({ className, ...rest }) => (
  <main
    className={cn(
      "relative mt-16 h-screen bg-background px-4 py-6 md:px-8 md:py-7 lg:px-16 lg:py-8",
      className
    )}
    {...rest}
  />
);

export { Layout, type LayoutProps };
