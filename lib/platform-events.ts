/**
 * Sistema de eventos globales MAD GAMES v4.
 * Los juegos emiten eventos; la plataforma (store) reacciona.
 * Los juegos no acceden directamente al estado global.
 */

import type { GameEventType, GameEventPayload } from "./types";

type ListenerFn = (payload: unknown) => void;

const listeners: Record<GameEventType, Set<ListenerFn>> = {
  gameStart: new Set(),
  gameEnd: new Set(),
  scoreUpdate: new Set(),
  newRecord: new Set(),
  levelUp: new Set(),
  itemPurchased: new Set(),
  itemEquipped: new Set(),
};

export const platform = {
  emit<T extends GameEventType>(event: T, payload: GameEventPayload[T]): void {
    const set = listeners[event];
    if (!set) return;
    set.forEach((fn) => {
      try {
        fn(payload);
      } catch (e) {
        console.warn("[MAD GAMES] Event listener error:", e);
      }
    });
  },

  on<T extends GameEventType>(event: T, fn: (payload: GameEventPayload[T]) => void): () => void {
    const set = listeners[event];
    set.add(fn as ListenerFn);
    return () => set.delete(fn as ListenerFn);
  },

  off<T extends GameEventType>(event: T, fn: (payload: GameEventPayload[T]) => void): void {
    listeners[event].delete(fn as ListenerFn);
  },
};
