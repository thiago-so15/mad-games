import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-dvh flex-col items-center justify-center bg-black text-center text-zinc-100">
      <p className="text-xs tracking-[0.4em] text-red-500">MAD OS</p>
      <h1 className="mt-4 text-2xl font-semibold">File not found</h1>
      <p className="mt-2 text-sm text-zinc-400">This path does not exist on this machine.</p>
      <Link
        href="/"
        className="mt-6 rounded-md bg-red-600 px-3 py-1.5 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
      >
        Elegir versión
      </Link>
    </div>
  );
}
