import { type FC } from "react";
import Link from "next/link";
import { buttonVariants } from "$/components/ui/button";

const UnauthorizedView: FC = () => (
  <div className="flex h-screen flex-col items-center justify-center bg-background">
    <span className="text-9xl font-bold text-gray-900 dark:text-gray-100">
      401
    </span>

    <h1 className="text-2xl font-medium text-gray-900 dark:text-gray-100">
      No tienes permiso para acceder a esta página
    </h1>

    <Link
      href="/dashboard"
      className={buttonVariants({ size: "lg", className: "mt-4" })}
    >
      Volver al Inicio
    </Link>
  </div>
);

export { UnauthorizedView };
