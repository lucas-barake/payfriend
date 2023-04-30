import { type FC } from "react";
import { Transition } from "@headlessui/react";
import { resolveValue, Toaster, ToastIcon } from "react-hot-toast";
import { TRPCClientError } from "@trpc/client";

function handleToastError(error: unknown, custom?: string): string {
  if (error instanceof Error) return error.message;
  if (error instanceof TRPCClientError) return custom ?? error.message;
  return "Error desconocido";
}

const StyledToaster: FC = () => (
  <Toaster>
    {(t) => (
      <Transition
        appear
        show={t.visible}
        className="mt-6 flex max-w-lg items-center gap-3 rounded-md border border-border bg-background py-2 px-4 text-foreground text-black dark:bg-background-secondary"
        enter="transition-all duration-150"
        enterFrom="opacity-0 scale-50"
        enterTo="opacity-100 scale-100"
        leave="transition-all duration-150"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-75"
      >
        <ToastIcon toast={t} />
        {resolveValue(t.message, t)}
      </Transition>
    )}
  </Toaster>
);

export { StyledToaster, handleToastError };
