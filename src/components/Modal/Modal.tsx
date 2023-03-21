import { Dialog, Transition } from "@headlessui/react";
import { type FC, Fragment, type ReactNode } from "react";

type Props = {
  show: boolean;
  onClose: () => void;
  afterClose?: () => void;
  title: string;
  children: ReactNode;
};

const Modal: FC<Props> = ({
  show: isOpen,
  onClose: closeModal,
  afterClose,
  title,
  children,
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded bg-white px-6 py-10 text-left align-middle shadow-xl transition-all dark:bg-neutral-800">
                <Dialog.Title
                  as="h1"
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-neutral-100"
                >
                  {title}
                </Dialog.Title>

                <div className="mt-2">{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
