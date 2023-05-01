import { type FC } from "react";
import ProfileMenu from "./profile-menu";
import NotificationBell from "./notification-bell";

const UserMenu: FC = () => (
  <div className="flex items-center gap-2">
    <ProfileMenu />
    <NotificationBell />
  </div>
);

export default UserMenu;
