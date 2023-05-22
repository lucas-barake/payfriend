import { type FC } from "react";
import { Loader2 } from "lucide-react";

const LoadingPage: FC = () => (
  <div className="flex h-screen flex-col items-center justify-center gap-2 bg-background">
    <div role="status">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />

      <span className="sr-only">Cargando...</span>
    </div>
  </div>
);

export default LoadingPage;
