import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">404</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">No encontramos esta página.</p>
      <Link
        href="/"
        className="mt-6 text-amber-600 hover:underline dark:text-amber-400"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
