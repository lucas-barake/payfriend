import { type NextPageWithLayout } from "$/pages/_app.page";
import { useRouter } from "next/router";
import LoadingPage from "$/components/pages/loading-page";
import { DesignLayout } from "$/components/layouts/design-layout";
import { Pages } from "$/lib/enums/pages";
import { useRedirectSession } from "$/hooks/use-redirect-session";
import React from "react";
import { View } from "$/pages/onboarding/(page-lib)/enums/view";
import PhoneInput from "$/pages/onboarding/(page-lib)/components/phone-input";
import { CustomHead } from "$/components/layouts/custom-head";
import OtpInput from "$/pages/onboarding/(page-lib)/components/otp-input";
import { type VerifyPhoneInput } from "$/server/api/routers/user/phone/otp/verify-phone/input";

/* ARCHIVED PAGE
 * This page has been archived as phone verification is no longer required.
 * Add .page.tsx to the file name to restore it.
 * */
const Onboard: NextPageWithLayout = () => {
  const router = useRouter();
  const session = useRedirectSession();
  const [currentView, setCurrentView] = React.useState<View>(View.PHONE_INPUT);
  const [phone, setPhone] = React.useState<VerifyPhoneInput["phone"]>();

  if (session.data?.user?.phoneVerified) {
    void router.push(Pages.DASHBOARD);
    return <LoadingPage />;
  }

  return (
    <DesignLayout showSignOut>
      <div className="flex items-center justify-center">
        <div className="flex max-w-2xl flex-col items-center justify-center gap-4 py-32 sm:py-48 lg:py-56">
          <h1 className="text-center text-4xl font-bold tracking-tight sm:text-6xl">
            Verifica tu <span className="text-indigo-500">celular</span>
          </h1>

          <div className="flex flex-col items-center gap-6 text-lg">
            {currentView === View.PHONE_INPUT ? (
              <PhoneInput setView={setCurrentView} setPhone={setPhone} />
            ) : (
              <OtpInput setView={setCurrentView} phone={phone} />
            )}
          </div>
        </div>
      </div>
    </DesignLayout>
  );
};

Onboard.getLayout = (page): JSX.Element => (
  <React.Fragment>
    <CustomHead title="Verifica tu celular" content="Verifica tu celular" />
    {page}
  </React.Fragment>
);

export default Onboard;
