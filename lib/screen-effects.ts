/**
 * Screen Effects — Efectos visuales cosméticos de la tienda.
 * Solo visuales, no afectan gameplay, timing, hitboxes ni mecánicas.
 */

import { useStore } from "./store";
import { getShopItemById } from "./shop";

export type ScreenEffectType = "shake" | "flash" | "glow";

/**
 * Dispara un efecto de pantalla si el usuario tiene uno equipado.
 * El efecto es puramente cosmético.
 */
export function triggerScreenEffect(effectType: ScreenEffectType) {
  const equippedEffectId = useStore.getState().inventory?.equipped?.screenEffect ?? null;
  if (!equippedEffectId) return;

  const item = getShopItemById(equippedEffectId);
  if (!item) return;

  // Solo disparar si el efecto equipado coincide con el tipo solicitado
  if (item.value !== effectType) return;

  const main = document.querySelector("main");
  if (!main) return;

  const className = `effect-${effectType}`;
  main.classList.remove(className);
  // Force reflow para reiniciar la animación
  void (main as HTMLElement).offsetWidth;
  main.classList.add(className);

  // Remover la clase después de la animación
  setTimeout(() => {
    main.classList.remove(className);
  }, 500);
}

/**
 * Dispara el efecto equipado (cualquiera que sea).
 * Útil para eventos genéricos como "nuevo récord".
 */
export function triggerEquippedEffect() {
  const equippedEffectId = useStore.getState().inventory?.equipped?.screenEffect ?? null;
  if (!equippedEffectId) return;

  const item = getShopItemById(equippedEffectId);
  if (!item) return;

  const effectType = item.value as ScreenEffectType;
  const main = document.querySelector("main");
  if (!main) return;

  const className = `effect-${effectType}`;
  main.classList.remove(className);
  void (main as HTMLElement).offsetWidth;
  main.classList.add(className);

  setTimeout(() => {
    main.classList.remove(className);
  }, 500);
}
