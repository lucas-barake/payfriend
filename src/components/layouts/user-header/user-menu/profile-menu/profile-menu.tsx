import { type FC, Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import Image from "next/image";
import cn from "$/lib/utils/cn";
import { signOut, useSession } from "next-auth/react";
import { LockClosedIcon } from "@heroicons/react/outline";
import { buttonVariants } from "$/components/ui/button";
import { ChevronDown, User } from "lucide-react";

const ProfileMenu: FC = () => {
  const session = useSession();
  const userImage = session.data?.user?.image ?? undefined;

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button
        className={buttonVariants({
          variant: "ghost",
          size: "sm",
          className: "flex items-center gap-2",
        })}
      >
        {userImage !== undefined ? (
          <Image
            src={userImage}
            alt="User image"
            className="h-5 w-5 cursor-pointer rounded-full"
            width={24}
            height={24}
          />
        ) : (
          <User className="h-8 w-8 cursor-pointer" />
        )}

        <ChevronDown
          className="h-4 w-4 text-black dark:text-neutral-200"
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
        <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md border border-border bg-background ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="divide-y divide-gray-100 py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  type="button"
                  className={cn(
                    active && "bg-background-secondary",
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
