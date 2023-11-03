import React, { type ComponentPropsWithoutRef, type FC } from "react";
import { cn } from "$/lib/utils/cn";
import {
  CustomHead,
  type CustomHeadProps,
} from "$/components/layouts/custom-head";
import { AuthWrapper } from "$/components/layouts/auth-wrapper";
import { Pages } from "$/lib/enums/pages";
import { APP_NAME } from "$/lib/constants/app-name";
import Link from "next/link";
import { ThemeSwitch } from "$/components/common/theme-switch";
import { ProfileMenu } from "$/components/layouts/main-layout/profile-menu";
import NotificationBell from "$/components/layouts/main-layout/notification-bell";
import { SubscriptionButton } from "./subscription-button";

type LayoutProps = ComponentPropsWithoutRef<"main"> & CustomHeadProps;

const MainLayout: FC<LayoutProps> = ({
  className,
  title,
  content,
  ...rest
}) => (
  <AuthWrapper>
    <CustomHead title={title} content={content} />

    <div className="relative flex min-h-screen flex-col bg-background font-sans">
      <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b bg-background/95 px-5 py-3 shadow-sm backdrop-blur lg:px-16 lg:py-4">
        <Link href={Pages.DASHBOARD} className="text-lg font-bold lg:text-xl">
          {APP_NAME}
        </Link>

        <div className="flex items-center gap-2">
          <SubscriptionButton />
          <ProfileMenu />
          <NotificationBell />
          <ThemeSwitch />
        </div>
      </header>

      <main
        className={cn(
          "flex-1 bg-background px-4 py-6 md:px-8 md:py-7 lg:px-16 lg:py-8",
          className
        )}
        {...rest}
      />

      <footer className="border-t px-5 py-4 text-sm lg:px-16">
        © 2023 {APP_NAME}
      </footer>
    </div>
  </AuthWrapper>
);

export { MainLayout, type LayoutProps };
