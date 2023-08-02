/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));
import NextPwa from "next-pwa";
const withPWA = NextPwa({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  /**
   * If you have the "experimental: { appDir: true }" setting enabled, then you
   * must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["es"],
    defaultLocale: "es",
  },
  pageExtensions: ["page.tsx", "page.ts"],
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
};
export default withPWA(config);
