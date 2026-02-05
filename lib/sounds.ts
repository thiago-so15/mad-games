/**
 * Sound System — Sonidos UI cosméticos de la tienda.
 * Reproduce sonidos basados en el pack de sonidos equipado.
 */

import { useStore } from "./store";
import { getShopItemById } from "./shop";

export type SoundType = "click" | "success" | "levelUp" | "purchase" | "equip" | "gameStart" | "gameEnd";
export type SoundPackId = "arcade" | "minimal" | "synth";

// Frecuencias base para generar tonos con Web Audio API
const SOUND_CONFIGS: Record<SoundPackId, Record<SoundType, { freq: number; duration: number; type: OscillatorType; gain: number }>> = {
  arcade: {
    click: { freq: 800, duration: 0.05, type: "square", gain: 0.15 },
    success: { freq: 523, duration: 0.15, type: "square", gain: 0.2 },
    levelUp: { freq: 440, duration: 0.3, type: "square", gain: 0.2 },
    purchase: { freq: 880, duration: 0.1, type: "square", gain: 0.15 },
    equip: { freq: 660, duration: 0.08, type: "square", gain: 0.12 },
    gameStart: { freq: 330, duration: 0.2, type: "square", gain: 0.18 },
    gameEnd: { freq: 220, duration: 0.25, type: "square", gain: 0.15 },
  },
  minimal: {
    click: { freq: 1200, duration: 0.03, type: "sine", gain: 0.08 },
    success: { freq: 880, duration: 0.1, type: "sine", gain: 0.1 },
    levelUp: { freq: 660, duration: 0.2, type: "sine", gain: 0.12 },
    purchase: { freq: 1000, duration: 0.08, type: "sine", gain: 0.1 },
    equip: { freq: 900, duration: 0.05, type: "sine", gain: 0.08 },
    gameStart: { freq: 500, duration: 0.15, type: "sine", gain: 0.1 },
    gameEnd: { freq: 400, duration: 0.15, type: "sine", gain: 0.08 },
  },
  synth: {
    click: { freq: 600, duration: 0.04, type: "sawtooth", gain: 0.1 },
    success: { freq: 440, duration: 0.12, type: "sawtooth", gain: 0.15 },
    levelUp: { freq: 330, duration: 0.25, type: "sawtooth", gain: 0.18 },
    purchase: { freq: 550, duration: 0.1, type: "sawtooth", gain: 0.12 },
    equip: { freq: 500, duration: 0.06, type: "sawtooth", gain: 0.1 },
    gameStart: { freq: 220, duration: 0.18, type: "sawtooth", gain: 0.15 },
    gameEnd: { freq: 180, duration: 0.2, type: "sawtooth", gain: 0.12 },
  },
};

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioContext) {
    try {
      audioContext = new AudioContext();
    } catch {
      return null;
    }
  }
  return audioContext;
}

/**
 * Reproduce un sonido si hay un pack equipado y el sonido está habilitado.
 */
export function playSound(soundType: SoundType) {
  const state = useStore.getState();
  
  // Verificar si el sonido está habilitado
  if (!state.settings?.soundEnabled) return;
  
  // Obtener el pack de sonidos equipado
  const equippedSoundPackId = state.inventory?.equipped?.soundPack ?? null;
  if (!equippedSoundPackId) return;

  const item = getShopItemById(equippedSoundPackId);
  if (!item) return;

  const packId = item.value as SoundPackId;
  const config = SOUND_CONFIGS[packId]?.[soundType];
  if (!config) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  // Reanudar el contexto si está suspendido (política de autoplay)
  if (ctx.state === "suspended") {
    ctx.resume();
  }

  try {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = config.type;
    oscillator.frequency.setValueAtTime(config.freq, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(config.gain, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + config.duration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + config.duration);

    // Para levelUp, añadir un segundo tono más alto
    if (soundType === "levelUp") {
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = config.type;
        osc2.frequency.setValueAtTime(config.freq * 1.5, ctx.currentTime);
        gain2.gain.setValueAtTime(config.gain, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + config.duration * 0.8);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(ctx.currentTime);
        osc2.stop(ctx.currentTime + config.duration * 0.8);
      }, config.duration * 500);
    }
  } catch {
    // Silently fail if audio is not available
  }
}

/**
 * Reproduce sonido de éxito/logro
 */
export function playSuccessSound() {
  playSound("success");
}

/**
 * Reproduce sonido de click/interacción
 */
export function playClickSound() {
  playSound("click");
}
