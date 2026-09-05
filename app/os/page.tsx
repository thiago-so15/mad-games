import { MadOS } from "@/components/os/MadOS";
import { Suspense } from "react";

export default function OsPage() {
  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      <Suspense fallback={<div className="h-full w-full bg-black" />}>
        <MadOS />
      </Suspense>
    </div>
  );
}
