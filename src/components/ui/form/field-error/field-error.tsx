import React from "react";

type Props = {
  message?: string | null | undefined;
};

export const FieldError: React.FC<Props> = ({ message }) => {
  if (!message) return null;

  return (
    <span className="text-sm font-semibold text-destructive">{message}</span>
  );
};
