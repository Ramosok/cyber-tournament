# cyber-tournament

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

Переменные окружения:

- `VITE_PREVIEW_STEP=1…3` — общая сетка, `=4` — плей-офф, `=done` — заглушка
  «турнир окончен». Показывает нужный экран без правки дат.
- `VITE_ALLOWED_HOSTS=".e2b.app,localhost"` — дополнительные Host для dev-сервера
  (превью за прокси).
- `VITE_SKIP_WEBFONTS=1` — не тянуть шрифты с Google Fonts на сборке. Без сети
  `vite-plugin-webfont-dl` трижды ретраит TLS и всё равно отдаёт сборку без
  `@font-face` (шрифты откатываются к системному sans-serif), так что для CI и
  офлайн-сборки флаг просто убирает лишние ~1.5 с ожидания.

## Какой этап показывается

Расписание (`src/shared/tournament/bettingStatus.ts`): старт **10.10.2026**, каждый этап
идёт сутки, плей-офф — четвёртые сутки (13.10). Дальше — турнир окончен.

`getBettingStatus()` возвращает:

- `isBettingOpen` — можно ли оставлять прогноз (false, пока этап идёт и после турнира);
- `isFinished` — все этапы позади;
- `currentStep` / `isFinalStep` — текущий или ближайший этап;
- `endsAt` — до чего тикает таймер;
- `nextStepStartsAt` — когда откроется следующий этап.

Что видит пользователь:

| Момент                    | Экран                                                            |
| ------------------------- | ---------------------------------------------------------------- |
| до старта и между этапами | сетка (этапы 1–3) или плей-офф (этап 4) + форма                  |
| этап 1–3 идёт             | «Прием прогнозов на N-й этап закрыт! Следующий этап откроется …» |
| идёт финал                | «Прием прогнозов закрыт! Идёт финал турнира»                     |
| после 13.10               | «Прием прогнозов закрыт! Турнир окончен»                         |

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
