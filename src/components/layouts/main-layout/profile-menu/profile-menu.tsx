import React from "react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "$/components/ui/button";
import { DropdownMenu } from "$/components/ui/dropdown-menu";
import { Avatar } from "$/components/ui/avatar";
import { LogOut } from "lucide-react";

export const ProfileMenu: React.FC = () => {
  const session = useSession();
  const userImage = session.data?.user?.image ?? undefined;

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button variant="ghost" size="sm">
          <Avatar className="h-6 w-6">
            <Avatar.Image src={userImage} />

            <Avatar.Fallback className="bg-indigo-200 dark:bg-indigo-800">
              {session.data?.user?.name?.charAt(0) ?? "?"}
            </Avatar.Fallback>
          </Avatar>
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content className="w-56">
        <DropdownMenu.Label>
          {session.data?.user?.name ?? "Usuario"}
          <p className="text-xs leading-none text-muted-foreground">
            {session.data?.user?.email ?? ""}
          </p>
        </DropdownMenu.Label>

        <DropdownMenu.Separator />

        <DropdownMenu.Group>
          <DropdownMenu.Item asChild>
            <button
              type="button"
              onClick={() => {
                void signOut();
              }}
              className="w-full cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
            </button>
          </DropdownMenu.Item>
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};
