import { useEffect, useState } from "react";

export const PREVIEW_STEP_EVENT = "preview-step-change";

const STATUS_UPDATE_INTERVAL_MS = 60_000;

const listeners = new Set<() => void>();
let currentNow = new Date();
let activeTicker: ReturnType<typeof setInterval> | null = null;

const notifyListeners = (): void => {
  currentNow = new Date();

  for (const listener of listeners) {
    listener();
  }
};

const startTicker = (): void => {
  if (activeTicker !== null) {
    return;
  }

  activeTicker = setInterval(notifyListeners, STATUS_UPDATE_INTERVAL_MS);

  if (typeof window !== "undefined") {
    window.addEventListener("storage", notifyListeners);
    window.addEventListener("focus", notifyListeners);
    window.addEventListener(PREVIEW_STEP_EVENT, notifyListeners);
  }
};

const stopTickerIfIdle = (): void => {
  if (listeners.size > 0 || activeTicker === null) {
    return;
  }

  clearInterval(activeTicker);
  activeTicker = null;

  if (typeof window !== "undefined") {
    window.removeEventListener("storage", notifyListeners);
    window.removeEventListener("focus", notifyListeners);
    window.removeEventListener(PREVIEW_STEP_EVENT, notifyListeners);
  }
};

export const useNow = (): Date => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const handleTick = (): void => {
      setNow(currentNow);
    };

    listeners.add(handleTick);
    startTicker();

    return () => {
      listeners.delete(handleTick);
      stopTickerIfIdle();
    };
  }, []);

  return now;
};
