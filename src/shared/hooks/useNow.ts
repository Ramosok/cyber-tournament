import { useEffect, useState } from "react";

/**
 * Текущее время, обновляющееся по расписанию.
 *
 * Вместо того чтобы каждый компонент держал собственный useState с датой
 * и useEffect с интервалом, он берёт `useNow(...)` и выводит статус/таймер
 * как чистые производные: `getBettingStatus(now)`, `calculateTimeLeft(...)`.
 */
export const useNow = (intervalMs: number): Date => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, intervalMs);

    return () => clearInterval(timer);
  }, [intervalMs]);

  return now;
};
