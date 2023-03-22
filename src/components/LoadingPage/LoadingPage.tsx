import { type FC } from "react";
import LoadingSpinnerIcon from "$/components/Icons/LoadingSpinnerIcon";

const LoadingPage: FC = () => (
  <div className="flex h-screen items-center justify-center dark:bg-neutral-800">
    <div className="flex flex-col items-center justify-center space-y-2">
      <div role="status">
        <LoadingSpinnerIcon />
        <span className="sr-only">Cargando...</span>
      </div>
    </div>
  </div>
);

export default LoadingPage;
