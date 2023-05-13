import { type FC } from "react";
import LoadingSpinner from "$/components/ui/icons/loading-spinner";

const LoadingPage: FC = () => (
  <div className="flex h-screen flex-col items-center justify-center gap-2 bg-background">
    <div role="status">
      <LoadingSpinner />
      <span className="sr-only">Cargando...</span>
    </div>
  </div>
);

export default LoadingPage;
