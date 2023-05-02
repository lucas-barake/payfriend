import { type FC, type ReactNode } from "react";
import { AuthWrapper } from "$/components/layouts/auth-wrapper";
import { UserHeader } from "$/components/layouts/user-header";
import { CustomHead, CustomHeadProps } from "$/components/layouts/custom-head";

type Props = {
  children: ReactNode;
} & CustomHeadProps;

const AuthLayout: FC<Props> = ({ children, ...customHeadProps }) => (
  <AuthWrapper>
    <CustomHead {...customHeadProps} />

    <UserHeader />

    {children}
  </AuthWrapper>
);

export { AuthLayout };
