import { type FC, Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import Image from "next/image";
import { ChevronDownIcon, UserCircleIcon } from "@heroicons/react/solid";
import cs from "$/utils/cs";
import { signOut, useSession } from "next-auth/react";
import { LockClosedIcon } from "@heroicons/react/outline";

const ProfileMenu: FC = () => {
  const session = useSession();
  const userImage = session.data?.user?.image ?? undefined;

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="transform-all group flex inline-flex items-center items-center justify-center gap-2 rounded px-3 py-2 text-sm font-medium text-gray-700 duration-200 ease-in-out hover:bg-gray-100 hover:text-gray-900 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:hover:text-neutral-100">
        {userImage !== undefined ? (
          <Image
            src={userImage}
            alt="User image"
            className="h-5 w-5 cursor-pointer rounded-full"
            width={24}
            height={24}
          />
        ) : (
          <UserCircleIcon className="h-8 w-8 cursor-pointer" />
        )}

        <span className="hidden font-bold dark:text-white sm:inline-block">
          {session.data?.user?.name ?? "User"}
        </span>

        <ChevronDownIcon
          className="h-3 w-3 text-black dark:text-neutral-200"
          aria-hidden="true"
        />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-neutral-700">
          <div className="divide-y divide-gray-100 py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  type="button"
                  className={cs(
                    active && "bg-gray-100 dark:bg-neutral-600",
                    "flex w-full items-center gap-1 self-stretch px-4 py-2 text-sm"
                  )}
                  onClick={() => {
                    void signOut();
                  }}
                >
                  <LockClosedIcon
                    className="h-4 w-4 stroke-2 text-black dark:text-neutral-200"
                    aria-hidden="true"
                  />
                  Cerrar sesión
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default ProfileMenu;
