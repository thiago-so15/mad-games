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
    click: { freq: 800, duration: 0.06, type: "square", gain: 0.25 },
    success: { freq: 523, duration: 0.16, type: "square", gain: 0.3 },
    levelUp: { freq: 440, duration: 0.32, type: "square", gain: 0.3 },
    purchase: { freq: 880, duration: 0.12, type: "square", gain: 0.25 },
    equip: { freq: 660, duration: 0.1, type: "square", gain: 0.25 },
    gameStart: { freq: 330, duration: 0.22, type: "square", gain: 0.28 },
    gameEnd: { freq: 220, duration: 0.27, type: "square", gain: 0.25 },
  },
  minimal: {
    click: { freq: 1200, duration: 0.04, type: "sine", gain: 0.18 },
    success: { freq: 880, duration: 0.11, type: "sine", gain: 0.22 },
    levelUp: { freq: 660, duration: 0.22, type: "sine", gain: 0.24 },
    purchase: { freq: 1000, duration: 0.09, type: "sine", gain: 0.2 },
    equip: { freq: 900, duration: 0.06, type: "sine", gain: 0.2 },
    gameStart: { freq: 500, duration: 0.16, type: "sine", gain: 0.22 },
    gameEnd: { freq: 400, duration: 0.16, type: "sine", gain: 0.2 },
  },
  synth: {
    click: { freq: 600, duration: 0.05, type: "sawtooth", gain: 0.2 },
    success: { freq: 440, duration: 0.13, type: "sawtooth", gain: 0.26 },
    levelUp: { freq: 330, duration: 0.27, type: "sawtooth", gain: 0.28 },
    purchase: { freq: 550, duration: 0.11, type: "sawtooth", gain: 0.22 },
    equip: { freq: 500, duration: 0.08, type: "sawtooth", gain: 0.22 },
    gameStart: { freq: 220, duration: 0.2, type: "sawtooth", gain: 0.25 },
    gameEnd: { freq: 180, duration: 0.22, type: "sawtooth", gain: 0.22 },
  },
};

let audioContext: AudioContext | null = null;

function playTone(
  ctx: AudioContext,
  config: { freq: number; duration: number; type: OscillatorType; gain: number },
  soundType: SoundType
) {
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
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    const secondStart = ctx.currentTime + config.duration * 0.45;
    const secondDuration = config.duration * 0.8;
    osc2.type = config.type;
    osc2.frequency.setValueAtTime(config.freq * 1.5, secondStart);
    gain2.gain.setValueAtTime(config.gain, secondStart);
    gain2.gain.exponentialRampToValueAtTime(0.001, secondStart + secondDuration);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(secondStart);
    osc2.stop(secondStart + secondDuration);
  }
}

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioContext) {
    try {
      const AudioCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtor) return null;
      audioContext = new AudioCtor();
    } catch {
      return null;
    }
  }
  return audioContext;
}

/**
 * Reproduce un sonido si hay un pack equipado y el sonido está habilitado.
 */
export function playSound(soundType: SoundType, opts?: { packItemId?: string }) {
  const state = useStore.getState();
  
  // Verificar si el sonido está habilitado
  if (!state.settings?.soundEnabled) return;
  
  // Obtener el pack de sonidos equipado
  const equippedSoundPackId = opts?.packItemId ?? state.inventory?.equipped?.soundPack ?? null;
  const item = equippedSoundPackId ? getShopItemById(equippedSoundPackId) : null;
  const maybePackId = item?.value as SoundPackId | undefined;
  // Fallback: siempre tener sonido base si el usuario activó Sonido master
  const packId: SoundPackId = maybePackId && SOUND_CONFIGS[maybePackId] ? maybePackId : "arcade";
  const config = SOUND_CONFIGS[packId][soundType];
  if (!config) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  // Reanudar el contexto si está suspendido (política de autoplay)
  if (ctx.state === "suspended") {
    ctx.resume();
  }

  try {
    if (ctx.state === "running") {
      playTone(ctx, config, soundType);
      return;
    }
    // Si el contexto estaba suspendido, intentamos reanudar y luego reproducir
    void ctx.resume().then(() => {
      if (ctx.state === "running") playTone(ctx, config, soundType);
    }).catch(() => {});
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
