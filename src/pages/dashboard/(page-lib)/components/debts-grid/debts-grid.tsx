import React from "react";

type Props = {
  children: React.ReactNode;
};

const DebtsGrid: React.FC<Props> = ({ children }) => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {children}
    </div>
  );
};

export default DebtsGrid;
