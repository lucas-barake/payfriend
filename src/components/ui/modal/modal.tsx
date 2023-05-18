import { Dialog, Transition } from "@headlessui/react";
import {
  type ComponentPropsWithoutRef,
  type FC,
  Fragment,
  type ReactNode,
} from "react";
import { X } from "lucide-react";
import { cn } from "$/lib/utils/cn";

export type ModalStateProps = {
  show: boolean;
  onClose: ComponentPropsWithoutRef<typeof Dialog>["onClose"];
};

type ModalProps = {
  afterClose?: () => void;
  title: string;
  children: ReactNode;
  className?: string;
} & ModalStateProps;

const Modal: FC<ModalProps> = ({
  show: isOpen,
  onClose: closeModal,
  afterClose,
  title,
  children,
  className,
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={closeModal}
      >
        <div className="text-center sm:min-h-screen">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-background/60 backdrop-blur-sm transition-all duration-100" />
          </Transition.Child>

          <span
            className="inline-block h-screen sm:align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
            afterLeave={afterClose}
          >
            <Dialog.Panel
              className={cn(
                "inline-block w-full transform rounded-md border border-border bg-background p-6 text-left align-middle transition-all sm:max-w-lg",
                className
              )}
            >
              <Dialog.Title
                as="h1"
                className="flex justify-between text-lg font-medium leading-6 text-gray-900 dark:text-neutral-100"
              >
                {title}

                <X
                  className="h-5 w-5 cursor-pointer"
                  onClick={() => {
                    closeModal(false);
                  }}
                />
              </Dialog.Title>

              <div className="mt-2">{children}</div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export { Modal, type ModalProps };
