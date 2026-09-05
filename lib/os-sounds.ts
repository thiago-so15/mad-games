type Tone = "ui" | "notify" | "error" | "success";

let audioContext: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!audioContext) audioContext = new Ctor();
  return audioContext;
}

export function playOsSound(tone: Tone, enabled: boolean, pack = "soft"): void {
  if (!enabled) return;
  const ctx = getContext();
  if (!ctx) return;
  void ctx.resume();

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  const profiles: Record<string, Record<Tone, { freq: number; freq2?: number; duration: number }>> = {
    soft: {
      ui: { freq: 420, duration: 0.05 },
      notify: { freq: 640, freq2: 880, duration: 0.12 },
      error: { freq: 180, duration: 0.16 },
      success: { freq: 520, freq2: 780, duration: 0.14 },
    },
    click: {
      ui: { freq: 880, duration: 0.03 },
      notify: { freq: 720, freq2: 960, duration: 0.1 },
      error: { freq: 140, duration: 0.12 },
      success: { freq: 600, freq2: 900, duration: 0.1 },
    },
    terminal: {
      ui: { freq: 740, duration: 0.04 },
      notify: { freq: 480, freq2: 960, duration: 0.16 },
      error: { freq: 220, duration: 0.18 },
      success: { freq: 440, freq2: 660, duration: 0.14 },
    },
  };

  const packProfile = profiles[pack] ?? profiles.soft;
  const profile = packProfile[tone];
  osc.type = pack === "terminal" ? "square" : "sine";
  osc.frequency.setValueAtTime(profile.freq, now);
  if (profile.freq2) {
    osc.frequency.exponentialRampToValueAtTime(profile.freq2, now + profile.duration * 0.7);
  }
  gain.gain.setValueAtTime(0.05, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + profile.duration);
  osc.start(now);
  osc.stop(now + profile.duration);
}
