/* eslint-disable react/button-has-type */
import { type ComponentPropsWithoutRef, type FC } from "react";
import cs from "$/utils/cs";

const COLOR_MAP = {
  indigo:
    "bg-indigo-600/95 border border-indigo-600/95 dark:border-indigo-600 text-neutral-100 hover:bg-indigo-600",
  red: "bg-red-500 text-gray-100 hover:bg-red-600",
  emerald: "bg-emerald-600 text-gray-100 hover:bg-emerald-700",
  orange: "bg-orange-500 text-gray-100 hover:bg-orange-500/90",
  amber: "bg-amber-600 text-gray-100 hover:bg-amber-600/90",
  teal: "bg-teal-600 text-gray-100 hover:bg-teal-700",
  lime: "bg-lime-600 text-gray-100 hover:bg-lime-700",
  green: "bg-green-600 text-gray-100 hover:bg-green-700",
  cyan: "bg-cyan-600 text-gray-100 hover:bg-cyan-700",
  sky: "bg-sky-600 text-gray-100 hover:bg-sky-700",
  blue: "bg-blue-600 text-gray-100 hover:bg-blue-700",
  violet: "bg-violet-600 text-gray-100 hover:bg-violet-700",
  purple: "bg-purple-600 text-gray-100 hover:bg-purple-700",
  fuchsia: "bg-fuchsia-600 text-gray-100 hover:bg-fuchsia-700",
  pink: "bg-pink-600 text-gray-100 hover:bg-pink-700",
  rose: "bg-rose-600 text-gray-100 hover:bg-rose-700",
  slate: "bg-slate-600 text-gray-100 hover:bg-slate-700",
  gray: "bg-gray-600 text-gray-100 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-800",
  zinc: "bg-zinc-600 text-gray-100 hover:bg-zinc-700",
  neutral:
    "bg-neutral-600 text-gray-100 hover:bg-neutral-700 dark:bg-neutral-700 dark:hover:bg-neutral-600",
  stone: "bg-stone-600 text-gray-100 hover:bg-stone-700",
};

const OUTLINE_MAP: typeof COLOR_MAP = {
  indigo:
    "text-indigo-600 border-2 border-indigo-600 hover:border-indigo-700 hover:text-indigo-700 hover:bg-indigo-200 dark:hover:bg-indigo-900 dark:hover:text-gray-100 dark:text-indigo-400 dark:border-indigo-400",
  red: "text-red-600 border-2 border-red-600 hover:border-red-600 hover:text-red-600 hover:bg-red-200 dark:hover:bg-red-900 dark:hover:text-gray-100 dark:text-red-400 dark:border-red-400",
  emerald:
    "text-emerald-600 border-2 border-emerald-600 hover:border-emerald-700 hover:text-emerald-700 hover:bg-emerald-200 dark:hover:bg-emerald-900 dark:hover:text-gray-100 dark:text-emerald-400 dark:border-emerald-400",
  orange:
    "text-orange-600 border-2 border-orange-600 hover:border-orange-700 hover:text-orange-700 hover:bg-orange-200 dark:hover:bg-orange-900 dark:hover:text-gray-100 dark:text-orange-400 dark:border-orange-400",
  amber:
    "text-amber-500 border-2 border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500 dark:hover:text-gray-100",
  teal: "text-teal-600 border-2 border-teal-600 hover:border-teal-700 hover:text-teal-700 hover:bg-teal-200 dark:hover:bg-teal-900 dark:hover:text-gray-100 dark:text-teal-400 dark:border-teal-400",
  lime: "text-lime-600 border-2 border-lime-600 hover:border-lime-700 hover:text-lime-700 hover:bg-lime-200 dark:hover:bg-lime-900 dark:hover:text-gray-100 dark:text-lime-400 dark:border-lime-400",
  green:
    "text-green-600 border-2 border-green-600 hover:border-green-700 hover:text-green-700 hover:bg-green-200 dark:hover:bg-green-900 dark:hover:text-gray-100 dark:text-green-400 dark:border-green-400",
  cyan: "text-cyan-600 border-2 border-cyan-600 hover:border-cyan-700 hover:text-cyan-700 hover:bg-cyan-200 dark:hover:bg-cyan-900 dark:hover:text-gray-100 dark:text-cyan-400 dark:border-cyan-400",
  sky: "text-sky-600 border-2 border-sky-600 hover:border-sky-700 hover:text-sky-700 hover:bg-sky-200 dark:hover:bg-sky-900 dark:hover:text-gray-100 dark:text-sky-400 dark:border-sky-400",
  blue: "text-blue-600 border-2 border-blue-600 hover:border-blue-700 hover:text-blue-700 hover:bg-blue-200 dark:hover:bg-blue-900 dark:hover:text-gray-100 dark:text-blue-400 dark:border-blue-400",
  violet:
    "text-violet-600 border-2 border-violet-600 hover:border-violet-700 hover:text-violet-700 hover:bg-violet-200 dark:hover:bg-violet-900 dark:hover:text-gray-100 dark:text-violet-400 dark:border-violet-400",
  purple:
    "text-purple-600 border-2 border-purple-600 hover:border-purple-700 hover:text-purple-700 hover:bg-purple-200 dark:hover:bg-purple-900 dark:hover:text-gray-100 dark:text-purple-400 dark:border-purple-400",
  fuchsia:
    "text-fuchsia-600 border-2 border-fuchsia-600 hover:border-fuchsia-700 hover:text-fuchsia-700 hover:bg-fuchsia-200 dark:hover:bg-fuchsia-900 dark:hover:text-gray-100 dark:text-fuchsia-400 dark:border-fuchsia-400",
  pink: "text-pink-600 border-2 border-pink-600 hover:border-pink-700 hover:text-pink-700 hover:bg-pink-200 dark:hover:bg-pink-900 dark:hover:text-gray-100 dark:text-pink-400 dark:border-pink-400",
  rose: "text-rose-600 border-2 border-rose-600 hover:border-rose-700 hover:text-rose-700 hover:bg-rose-200 dark:hover:bg-rose-900 dark:hover:text-gray-100 dark:text-rose-400 dark:border-rose-400",
  slate:
    "text-slate-600 border-2 border-slate-600 hover:border-slate-700 hover:text-slate-700 hover:bg-slate-200 dark:hover:bg-slate-900 dark:hover:text-gray-100 dark:text-slate-400 dark:border-slate-400",
  gray: "text-gray-600 border-2 border-gray-600 hover:border-gray-700 hover:text-gray-700 hover:bg-gray-200 dark:hover:bg-gray-900 dark:hover:text-gray-100 dark:text-gray-400 dark:border-gray-400",
  zinc: "text-zinc-600 border-2 border-zinc-600 hover:border-zinc-700 hover:text-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-900 dark:hover:text-gray-100 dark:text-zinc-400 dark:border-zinc-400",
  neutral:
    "text-neutral-700 border border-neutral-300 hover:border-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900/30 dark:hover:text-neutral-100 dark:text-neutral-300 dark:border-neutral-500",
  stone:
    "text-stone-600 border-2 border-stone-600 hover:border-stone-700 hover:text-stone-700 hover:bg-stone-200 dark:hover:bg-stone-900 dark:hover:text-gray-100 dark:text-stone-400 dark:border-stone-400",
};

type Props = {
  color?: keyof typeof COLOR_MAP;
  outline?: boolean;
  loading?: boolean;
  noPadding?: boolean;
} & ComponentPropsWithoutRef<"button">;

const Button: FC<Props> = ({
  children,
  className,
  disabled = false,
  loading = false,
  type,
  color = undefined,
  outline = false,
  noPadding = false,
  ...props
}) => (
  <button
    {...props}
    disabled={disabled || loading}
    type={type ?? "button"}
    className={cs(
      "inline-flex items-start justify-start rounded text-base font-medium shadow outline-none transition-all duration-200 focus:outline-none focus:ring-offset-0 active:translate-y-0.5 sm:mt-0",
      !noPadding && "px-3 py-1.5",
      className,
      (disabled || loading) && "cursor-not-allowed opacity-50",
      loading && "flex items-center justify-center",
      color !== undefined && !outline && COLOR_MAP[color],
      color !== undefined && outline && OUTLINE_MAP[color]
    )}
  >
    {loading && (
      <svg
        className="mr-2 -ml-0.5 h-5 w-5 animate-spin text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    )}
    {children}
  </button>
);

export default Button;
