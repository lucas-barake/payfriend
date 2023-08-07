import React from "react";
import { cn } from "$/lib/utils/cn";

type Props = {
  className?: string;
  children: React.ReactNode;
};

export const Group: React.FC<Props> = ({ children, className }) => (
  <div className={cn("flex w-full flex-col gap-2", className)}>{children}</div>
);
