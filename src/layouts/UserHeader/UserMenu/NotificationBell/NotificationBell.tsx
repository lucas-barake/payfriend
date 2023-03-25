import { type FC, Fragment } from "react";
import { BellIcon } from "@heroicons/react/outline";
import { Menu, Transition } from "@headlessui/react";
import { api } from "$/utils/api";
import { useSession } from "next-auth/react";
import PendingInviteRow from "$/layouts/UserHeader/UserMenu/NotificationBell/PendingInviteRow";
import TimeInMs from "$/enums/TimeInMs";

const NotificationBell: FC = () => {
  const session = useSession();

  const query = api.groupInvites.getUserInvites.useQuery(undefined, {
    enabled: session.data?.user.emailVerified != null,
    staleTime: TimeInMs.TenSeconds,
    refetchOnWindowFocus: true,
    retry: false,
  });
  const allPendingInvites = query.data ?? [];

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="transform-all group flex inline-flex items-center items-center justify-center gap-2 rounded px-3 py-2 text-sm font-medium text-gray-700 duration-200 ease-in-out hover:bg-gray-100 hover:text-gray-900 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:hover:text-neutral-100">
        <div className="relative inline-flex">
          <BellIcon className="h-5 w-5" />

          {allPendingInvites.length > 0 && (
            <span className="absolute top-0.5 right-0.5 -mt-1 -mr-1 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-600 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
          )}
        </div>

        <span className="sr-only">Notificaciones</span>
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
        <Menu.Items className="absolute -right-28 z-10 mt-2 w-72 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-neutral-700">
          <div className="divide-y divide-gray-100 py-1">
            {allPendingInvites.length === 0 ? (
              <Menu.Item
                as="div"
                className="flex w-full items-center gap-1 self-stretch px-4 py-2 text-sm"
              >
                No hay invitaciones pendientes
              </Menu.Item>
            ) : (
              allPendingInvites.map((invite) => (
                <PendingInviteRow key={invite.debtTableId} invite={invite} />
              ))
            )}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default NotificationBell;
