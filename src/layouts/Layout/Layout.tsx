import { type ComponentPropsWithoutRef, type FC } from "react";
import cs from "$/utils/cs";

export type LayoutProps = ComponentPropsWithoutRef<"main">;

const Layout: FC<LayoutProps> = ({ className, ...rest }) => (
  <main
    className={cs(
      "relative mt-16 h-screen px-4 py-6 dark:bg-neutral-800 md:px-8 md:py-7 lg:px-16 lg:py-8",
      className
    )}
    {...rest}
  />
);

export default Layout;
