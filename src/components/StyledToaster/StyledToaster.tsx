import { type FC } from "react";
import { Transition } from "@headlessui/react";
import { resolveValue, Toaster, ToastIcon } from "react-hot-toast";

const StyledToaster: FC = () => (
  <Toaster>
    {(t) => (
      <Transition
        appear
        show={t.visible}
        className="mt-6 flex items-center gap-3 rounded-md py-2 px-4 text-white shadow-md dark:bg-neutral-800"
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

export default StyledToaster;
