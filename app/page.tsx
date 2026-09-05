import { VersionPicker } from "@/components/ui/VersionPicker";

export default function VersionSelectPage() {
  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_10%,rgba(220,38,38,0.18),transparent_42%),radial-gradient(ellipse_at_80%_90%,rgba(127,29,29,0.28),transparent_46%)]" />
      <div className="relative h-full">
        <VersionPicker variant="page" />
      </div>
    </div>
  );
}
