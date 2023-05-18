import { Dialog, Transition } from "@headlessui/react";
import React, { type FC, Fragment, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "$/lib/utils/cn";

const Title: React.FC<{
  className?: string;
  children: ReactNode;
}> = ({ children, className }) => {
  return (
    <Dialog.Title
      className={cn("text-lg font-bold leading-6 text-foreground", className)}
    >
      {children}
    </Dialog.Title>
  );
};

export type SheetProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: ReactNode;
  afterClose?: () => void;
  className?: string;
};

const BaseSheet: FC<SheetProps> = ({
  open,
  setOpen,
  children,
  afterClose,
  className,
}) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-all duration-100" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-200 sm:duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
                afterLeave={afterClose}
              >
                <Dialog.Panel
                  className={cn(
                    "pointer-events-auto flex w-screen max-w-md flex-col border border-border",
                    className
                  )}
                >
                  <div className="h-full flex-1 overflow-y-scroll bg-background px-4 py-6 sm:px-6">
                    {children}

                    <button
                      type="button"
                      className="absolute right-6 top-6 text-gray-400 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-200 md:right-8"
                      onClick={() => {
                        setOpen(false);
                      }}
                    >
                      <span className="sr-only">Cerrar Configuración</span>
                      <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

const Sheet = Object.assign(BaseSheet, {
  Title,
});

export { Sheet };
