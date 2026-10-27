import { useEffect, useState } from "react";

export const PREVIEW_STEP_EVENT = "preview-step-change";

/**
 * Текущее время, обновляющееся по расписанию и при смене тестового этапа
 * в `localStorage` (через `storage`, `focus` или `preview-step-change`).
 */
export const useNow = (intervalMs: number): Date => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const refresh = (): void => {
      setNow(new Date());
    };

    const timer = setInterval(refresh, intervalMs);

    if (typeof window !== "undefined") {
      window.addEventListener("storage", refresh);
      window.addEventListener("focus", refresh);
      window.addEventListener(PREVIEW_STEP_EVENT, refresh);
    }

    return () => {
      clearInterval(timer);

      if (typeof window !== "undefined") {
        window.removeEventListener("storage", refresh);
        window.removeEventListener("focus", refresh);
        window.removeEventListener(PREVIEW_STEP_EVENT, refresh);
      }
    };
  }, [intervalMs]);

  return now;
};
