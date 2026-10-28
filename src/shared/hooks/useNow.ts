import { useEffect, useState } from "react";

export const PREVIEW_STEP_EVENT = "preview-step-change";

const listeners = new Set<() => void>();
let currentNow = new Date();
let activeTimer: ReturnType<typeof setInterval> | null = null;
let activeIntervalMs = 0;

const notifyListeners = (): void => {
  currentNow = new Date();

  for (const listener of listeners) {
    listener();
  }
};

const startTicker = (intervalMs: number): void => {
  if (activeTimer !== null && activeIntervalMs === intervalMs) {
    return;
  }

  if (activeTimer !== null) {
    clearInterval(activeTimer);
  }

  activeIntervalMs = intervalMs;
  activeTimer = setInterval(notifyListeners, intervalMs);

  if (typeof window !== "undefined") {
    window.addEventListener("storage", notifyListeners);
    window.addEventListener("focus", notifyListeners);
    window.addEventListener(PREVIEW_STEP_EVENT, notifyListeners);
  }
};

const stopTickerIfIdle = (): void => {
  if (listeners.size > 0 || activeTimer === null) {
    return;
  }

  clearInterval(activeTimer);
  activeTimer = null;
  activeIntervalMs = 0;

  if (typeof window !== "undefined") {
    window.removeEventListener("storage", notifyListeners);
    window.removeEventListener("focus", notifyListeners);
    window.removeEventListener(PREVIEW_STEP_EVENT, notifyListeners);
  }
};

export const useNow = (intervalMs: number): Date => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const handleTick = (): void => {
      setNow(currentNow);
    };

    listeners.add(handleTick);
    startTicker(intervalMs);

    return () => {
      listeners.delete(handleTick);
      stopTickerIfIdle();
    };
  }, [intervalMs]);

  return now;
};
