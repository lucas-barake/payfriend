import { type FC } from "react";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";

const GoBackButton: FC = () => {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        void router.back();
      }}
      className="flex items-center gap-3 self-start rounded-full bg-neutral-100 p-2.5 transition-transform duration-200 active:scale-95 dark:bg-neutral-700"
    >
      <ArrowLeftIcon className="h-6 w-6" />
    </button>
  );
};

export default GoBackButton;
