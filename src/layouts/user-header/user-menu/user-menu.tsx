import { type FC } from "react";
import ProfileMenu from "./profile-menu";
import NotificationBell from "./NotificationBell";

const UserMenu: FC = () => (
  <div className="flex items-center gap-2">
    <NotificationBell />
    <ProfileMenu />
  </div>
);

export default UserMenu;
