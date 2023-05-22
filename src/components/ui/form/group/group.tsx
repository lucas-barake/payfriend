import React from "react";
import { cn } from "$/lib/utils/cn";

type Props = {
  className?: string;
  children: React.ReactNode;
};

export const Group: React.FC<Props> = ({ children, className }) => (
  <div className={cn("grid w-full items-center gap-2", className)}>
    {children}
  </div>
);
