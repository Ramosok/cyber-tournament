# cyber-tournament
## https://www.hltv.org/events/9303/pgl-major-singapore-2026-stage-1
## https://arena.ai/agent/01a17e31-fbac-727d-b994-505eb608d45a

Лендинг прогнозов на StarLadder Budapest Major 2025: пользователь собирает прогноз
(общая сетка группового этапа или плей-офф) и отправляет его вместе с номером игрового счёта.

## Скрипты

| Команда              | Что делает                            |
| -------------------- | ------------------------------------- |
| `npm run dev`        | dev-сервер Vite (`--host`, порт 3000) |
| `npm run typecheck`  | `tsc --noEmit`                        |
| `npm run lint`       | ESLint по `src`                       |
| `npm run lint:fix`   | ESLint с автофиксом                   |
| `npm test`           | Vitest (однократный прогон)           |
| `npm run test:watch` | Vitest в режиме watch                 |
| `npm run format`     | Prettier по `src`                     |
| `npm run build`      | typecheck + прод-сборка в `build/`    |
| `npm run preview`    | отдача прод-сборки                    |

Переменные окружения и переключение этапов через `localStorage`:

- `localStorage.setItem("step", "1" | "2" | "3" | "4" | "1:closed" | "done" | "auto")` —
  переключает этап прямо в браузере (также поддерживаются ключи `previewStep`,
  `PREVIEW_STEP`, `VITE_PREVIEW_STEP`), имеет приоритет над `VITE_PREVIEW_STEP`
  и подхватывается без перезагрузки страницы.
- `VITE_PREVIEW_STEP=1…3` — общая сетка, `=4` — плей-офф, `=done` — заглушка
  «турнир окончен». Показывает нужный экран без правки дат.
- `VITE_ALLOWED_HOSTS=".e2b.app,localhost"` — дополнительные Host для dev-сервера
  (превью за прокси).
- `VITE_SITE_URL` — публичный адрес сайта для canonical/OG/JSON-LD
  (по умолчанию из `.env`, для продакшена переопределяется окружением).
- `VITE_SKIP_WEBFONTS=1` — не тянуть шрифты с Google Fonts на сборке. Без сети
  `vite-plugin-webfont-dl` трижды ретраит TLS и всё равно отдаёт сборку без
  `@font-face` (шрифты откатываются к системному sans-serif), так что для CI и
  офлайн-сборки флаг просто убирает лишние ~1.5 с ожидания.

## Какой этап показывается

Расписание (`src/shared/tournament/bettingStatus.ts`) задано по минскому времени (`UTC+3`):

| Этап     | Проведение этапа  | Открытие приёма   | Закрытие приёма   |
| -------- | ----------------- | ----------------- | ----------------- |
| Stage 1  | 24–27 ноября 2026 | 20.11.2026, 18:00 | 24.11.2026, 08:55 |
| Stage 2  | 28.11 – 01.12     | 24.11.2026, 18:00 | 28.11.2026, 08:55 |
| Stage 3  | 2–6 декабря 2026  | 28.11.2026, 18:00 | 02.12.2026, 08:55 |
| Playoffs | 10–13 декабря     | 07.12.2026, 10:00 | 10.12.2026, 11:55 |

`getBettingStatus()` возвращает:

- `isBettingOpen` — можно ли оставлять прогноз (false, пока приём на этап закрыт и после турнира);
- `isFinished` — все этапы позади (после 13.12.2026 23:59:59);
- `currentStep` / `isFinalStep` — текущий или ближайший этап;
- `endsAt` — до чего тикает таймер;
- `nextStepStartsAt` — когда откроется следующий этап.

Что видит пользователь:

| Момент                    | Экран                                                            |
| ------------------------- | ---------------------------------------------------------------- |
| окно приёма открыто       | сетка (этапы 1–3) или плей-офф (этап 4) + форма                  |
| приём на этап 1–3 закрыт  | «Прием прогнозов на N-й этап закрыт! Следующий этап откроется …» |
| идёт финал (10.12–13.12)  | «Прием прогнозов закрыт! Идёт финал турнира»                     |
| после 13.12               | «Прием прогнозов закрыт! Турнир окончен»                         |

Пулы команд: `STAGE_TEAM_LIST` — 16 участников группового этапа (8 прошедших в плей-офф

- 8 выбывших, ровно по числу ячеек), `TEAM_LIST` — 8 команд плей-офф.

`Bids` рендерит по условию:

```tsx
{
  bettingStatus.isFinalStep ? (
    <Playoff
      state={playoffState}
      teams={TEAM_LIST}
      onScoreChange={handleScoreChange}
    />
  ) : (
    <Stage
      selection={stageSelection}
      teams={STAGE_TEAM_LIST}
      onCellClick={handleCellClick}
    />
  );
}
```

## Единая модель прогноза

Оба сценария складывают результат в **одну и ту же** модель `Prediction`
(`src/shared/prediction/types.ts`):

```ts
type Prediction = GroupPickPrediction | MatchPrediction | WinnerPrediction;

type PredictionForm = {
  step: StepNumber; // какой этап прогнозируем
  predictions: readonly Prediction[]; // что уже собрано
  filledCount: number; // прогресс
  requiredCount: number; // сколько всего нужно
};
```

- `buildStagePredictions(selection, teamIndex)` — из 16 ячеек сетки.
- `buildPlayoffPredictions(state, teamIndex)` — из сетки плей-офф (7 матчей + чемпион).

Дальше всё общее: `isPredictionFormComplete()` для валидации и
`buildPredictionPayload()` для полей `f1…f7` + `step`. Форма и API не знают,
какой этап сейчас идёт.

### Валидация

Сценарии заполняются по-разному, поэтому и спрашиваем по-разному — за это
отвечает поле `mode` и `getPredictionValidationError()`:

| Сценарий  | Считаем                                                     | Сообщение                                                                                     |
| --------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `stage`   | 16 ячеек                                                    | «Заполните все ячейки команд (5 из 16)»                                                       |
| `playoff` | 7 матчей (чемпион выводится из счёта финала и не считается) | «Заполните счёт в матчах 1/4 финала (2 из 7)» — раунд подставляется из `firstIncompleteRound` |

Незавершённая серия (например 1:1) матчем не считается, поэтому прогресс
в плей-оффе не «залипает» на частично введённом счёте.

Поля `f1…f7`:

- плей-офф — по одной строке на матч: `Team Spirit 2:0 Team Falcons`;
- общая сетка — по одной строке на группу: `3-0: Team Spirit, Team Falcons` (6 групп).

## Тесты и CI

`npm test` (Vitest) покрывает логику, которая ломается молча:

- `setMatchScore` — посев 1/4, продвижение победителей, сброс зависимых раундов
  при правке счёта, отсутствие мутаций;
- `buildStagePredictions` / `buildPlayoffPredictions` — счётчики ячеек (16) и
  матчей (7), `firstIncompleteRound`, чемпион;
- `formatPredictionLines` / `buildPredictionPayload` — формат строк и раскладка
  по `f1…f7`;
- `getPredictionValidationError` — тексты отдельно для сетки и для плей-офф;
- `getBettingStatus` / `getBettingClosedMessage` / `getTimerTitle` — весь
  календарь, включая `VITE_PREVIEW_STEP`.

`.github/workflows/ci.yml` на каждый push и PR гоняет typecheck → lint → test →
build (сборка с `VITE_SKIP_WEBFONTS=1`, чтобы не зависеть от сети).

## React Compiler и хуки

React 19 + `babel-plugin-react-compiler` (включён в `vite.config.ts`):
компилятор сам мемоизирует компоненты и значения, поэтому ручной
мемоизации в коде нет — `useMemo`/`useCallback` удалены полностью.

`useState` оставлен только там, где это настоящие данные пользователя:

- `Bids`: `stageSelection` и `playoffState` (выбор команд и счёт);
- `AccountNumberForm`: номер счёта + `useActionState` для отправки.

Всё выводимое — чистые производные:

- `useNow(interval)` (`src/shared/hooks/useNow.ts`) — единственный тик;
  `Timer`, `Steps` и `Bids` берут статус как `getBettingStatus(now)`,
  а остаток — `calculateTimeLeft(endsAt, now)`;
- `pickedCellIndex` стал `useRef` (не участвует в рендере);
- статичные `createTeamIndex(...)` вынесены на уровень модуля.

## Производительность

- Логотипы команд были SVG-обёртками с base64-растром (до 4096×2749) на
  **3.79 MB** — сконвертированы в WebP 192×192 под 2× DPR: **241 KB** суммарно.
- Фоновые и промо-растры уменьшены до реальных размеров вывода и пережаты
  (исходники 2.09 MB → 584 KB; в прод-сборке `vite-plugin-image-optimizer`
  дожимает до ~490 KB).
- Бандл разрезан на `react-*` (вендор, кэшируется между деплоями) и `index-*`.
- Изображения: `loading="lazy"` + `decoding="async"` по умолчанию,
  `fetchPriority="high"` только у LCP-баннера в шапке.
- Раздача: brotli + gzip пресеты лежат рядом (`*.brotli`, `*.gz`).

## SEO

- Чистый `<head>`: один title, один description, canonical, robots,
  Open Graph (включая `og:image` 1200×630 — `public/og-cover.jpg`),
  Twitter Card `summary_large_image`, JSON-LD `SportsEvent`.
- `public/robots.txt`, `public/manifest.webmanifest`,
  `public/apple-touch-icon.png`.
- Абсолютные URL в canonical/OG/JSON-LD собираются из `VITE_SITE_URL`
  (подстановка Vite в `index.html`).
- Убраны мусорные мета-теги (`http-equiv="refresh"`, дублирующий
  `Content-Type`, `meta property="title"`, `og:image` с favicon.ico).

## Структура

```
src/
  shared/
    config.ts                     команды, поиск по id
    tournament/
      bettingStatus.ts            этапы турнира, приём прогнозов
      bettingClosedMessage.ts     текст вместо формы
      stageGrid.ts                разметка сетки 16 ячеек / 6 групп
      stageSelection.ts           выбор пользователя по ячейкам
      playoffRounds.ts            раунды, BO3/BO5
    prediction/                   единая модель прогноза и её сборка
    ui/                           Modal, Icon
  components/
    Bids/                         контейнер: Stage | Playoff + форма
      components/Stage            общая сетка (этапы 1–3)
      components/Playoff          плей-офф (этап 4), состояние — чистые функции
      components/Cell, TeamList, TeamItem
    AccountNumberForm             отправка прогноза
```

Состояние плей-офф меняется одной чистой функцией `setMatchScore()` — она же
продвигает победителя в следующий раунд и сбрасывает зависимые матчи.
Мутаций состояния и `useEffect`-синхронизации с родителем нет: `Bids` получает
готовые прогнозы через `useMemo`.

## Типизация

- `strict`, `exactOptionalPropertyTypes`, `noImplicitReturns`, `noImplicitOverride`,
  `noUnusedLocals/Parameters`; `noEmit` — проект не эмитит declaration-файлы.
- `baseUrl` исправлен на `.` (раньше алиас `@/*` не разрешался, и весь проект
  не проходил typecheck).
- `import.meta.env` типизирован строго (`strictImportMetaEnv`) — опечатка в имени
  переменной становится ошибкой.
- Доменные типы вместо строк: `TeamId`, `CellIndex`, `GroupLabel`, `PlayoffRoundKey`,
  `BestOf`, `StepNumber`; `Prediction` — дискриминированное объединение.
- В сетке плей-офф хранятся id команд, а не индексы массива; раунд — это список матчей
  (`{ teams, score }`), а не два параллельных массива.
- `noUncheckedIndexedAccess` не включён: CSS-модули объявлены через индексную
  сигнатуру, и флаг ломает каждый `className={styles.x}`. Вернуться к нему имеет смысл
  вместе с генерацией типов для CSS-модулей.
