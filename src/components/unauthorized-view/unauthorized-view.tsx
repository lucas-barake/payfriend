import { type FC } from "react";
import Link from "next/link";

const UnauthorizedView: FC = () => (
  <div className="flex h-screen flex-col items-center justify-center dark:bg-neutral-800">
    <span className="text-9xl font-bold text-gray-900 dark:text-gray-100">
      401
    </span>

    <h1 className="text-2xl font-medium text-gray-900 dark:text-gray-100">
      No tienes permiso para acceder a esta página
    </h1>

    <Link
      href="/dashboard"
      className="mt-4 rounded bg-indigo-600 px-3 py-1.5 font-bold text-white transition-colors duration-200 hover:bg-indigo-700"
    >
      Volver al Inicio
    </Link>
  </div>
);

export { UnauthorizedView };
