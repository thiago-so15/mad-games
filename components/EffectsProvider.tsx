"use client";

import { useEffect } from "react";
import { platform } from "@/lib/platform-events";
import { triggerEquippedEffect } from "@/lib/screen-effects";
import { playSound } from "@/lib/sounds";

/**
 * Conecta los eventos de la plataforma con los efectos de pantalla y sonidos.
 * Este componente debe montarse una vez en el layout.
 */
export function EffectsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Suscribirse a eventos y disparar efectos/sonidos
    const unsubGameStart = platform.on("gameStart", () => {
      playSound("gameStart");
    });

    const unsubGameEnd = platform.on("gameEnd", () => {
      playSound("gameEnd");
      triggerEquippedEffect();
    });

    const unsubNewRecord = platform.on("newRecord", () => {
      playSound("success");
      triggerEquippedEffect();
    });

    const unsubLevelUp = platform.on("levelUp", () => {
      playSound("levelUp");
      triggerEquippedEffect();
    });

    const unsubPurchase = platform.on("itemPurchased", () => {
      playSound("purchase");
      triggerEquippedEffect();
    });

    const unsubEquip = platform.on("itemEquipped", () => {
      playSound("equip");
    });

    return () => {
      unsubGameStart();
      unsubGameEnd();
      unsubNewRecord();
      unsubLevelUp();
      unsubPurchase();
      unsubEquip();
    };
  }, []);

  return <>{children}</>;
}
