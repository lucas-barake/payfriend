import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const Group = ({ children }: Props): JSX.Element => (
  <div className="flex flex-col gap-1">{children}</div>
);

export default Group;
