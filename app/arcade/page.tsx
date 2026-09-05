import Image from "next/image";
import { HomeQuickPlay } from "@/components/HomeQuickPlay";

export default function ArcadeHome() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <div className="animate-[fade-in_0.4s_ease-out]">
        <Image
          src="/mad-games-logo-tr.png"
          alt="MAD GAMES"
          width={280}
          height={280}
          className="mx-auto h-auto w-48 sm:w-56 md:w-64"
          priority
        />
      </div>

      <HomeQuickPlay />
    </div>
  );
}
