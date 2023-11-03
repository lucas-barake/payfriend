import React from "react";
import { Avatar } from "$/components/ui/avatar";
import { Button } from "$/components/ui/button";
import { X } from "lucide-react";

type Props = {
  onRemove: () => void;
  email: string;
};

const MemberRow: React.FC<Props> = ({ onRemove, email }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Avatar>
          <Avatar.Fallback>{email[0]}</Avatar.Fallback>
        </Avatar>

        <span className="max-w-[175px] truncate sm:max-w-[300px]">{email}</span>
      </div>

      <Button variant="destructive" size="sm" onClick={onRemove}>
        <span className="sr-only sm:not-sr-only">Eliminar</span>
        <span className="sm:sr-only">
          <X className="h-4 w-4" />
        </span>
      </Button>
    </div>
  );
};

export default MemberRow;
