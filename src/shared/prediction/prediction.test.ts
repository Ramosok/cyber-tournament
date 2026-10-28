import { describe, expect, it } from "vitest";

import type { PlayoffState } from "@/components/Bids/components/Playoff/types";
import type { StageSelection } from "@/shared/tournament/stageSelection";

import { buildPredictionPayload } from "@/components/AccountNumberForm/api/predictionPayload";
import { getPredictionValidationError } from "@/components/AccountNumberForm/api/predictionValidationError";
import { normalizeAccountNumber } from "@/components/AccountNumberForm/utils/normalizeAccountNumber";
import { buildPlayoffPredictions } from "@/components/Bids/components/Playoff/utils/buildPlayoffPredictions";
import { createInitialState } from "@/components/Bids/components/Playoff/utils/createInitialState";
import { setMatchScore } from "@/components/Bids/components/Playoff/utils/setMatchScore";
import {
  createTeamIndex,
  getStageTeamListByStep,
  STAGE_1_TEAM_LIST,
  STAGE_2_TEAM_LIST,
  STAGE_3_TEAM_LIST,
  STAGE_TEAM_LIST,
  TEAM_LIST,
} from "@/shared/config";
import { buildStagePredictions } from "@/shared/prediction/buildStagePredictions";
import { formatPredictionLines } from "@/shared/prediction/formatPrediction";
import {
  createPredictionForm,
  isPredictionFormComplete,
} from "@/shared/prediction/types";
import {
  STAGE_CELL_COUNT,
  STAGE_CELL_INDEXES,
} from "@/shared/tournament/stageGrid";
import {
  createEmptyStageSelection,
  setCellTeam,
} from "@/shared/tournament/stageSelection";

const stageTeams = createTeamIndex(STAGE_TEAM_LIST);
const playoffTeams = createTeamIndex(TEAM_LIST);

const fillAllCells = (): StageSelection =>
  STAGE_CELL_INDEXES.reduce<StageSelection>((selection, cellIndex, index) => {
    const team = STAGE_TEAM_LIST[index];

    return team ? setCellTeam(selection, cellIndex, team.id) : selection;
  }, createEmptyStageSelection());

const fillPlayoff = (): PlayoffState => {
  const scores: [number, number][] = [
    [2, 0],
    [2, 1],
    [0, 2],
    [2, 0],
  ];
  let state = createInitialState(TEAM_LIST);

  scores.forEach(([first, second], index) => {
    state = setMatchScore(state, "quarter", index, 0, String(first));
    state = setMatchScore(state, "quarter", index, 1, String(second));
  });

  state = setMatchScore(state, "semi", 0, 0, "2");
  state = setMatchScore(state, "semi", 0, 1, "0");
  state = setMatchScore(state, "semi", 1, 0, "1");
  state = setMatchScore(state, "semi", 1, 1, "2");
  state = setMatchScore(state, "final", 0, 0, "3");
  state = setMatchScore(state, "final", 0, 1, "1");
  state = setMatchScore(state, "thirdPlace", 0, 0, "0");
  state = setMatchScore(state, "thirdPlace", 0, 1, "2");

  return state;
};

describe("buildStagePredictions", () => {
  it("считает каждую из 16 ячеек", () => {
    const draft = buildStagePredictions(fillAllCells(), stageTeams);

    expect(STAGE_CELL_COUNT).toBe(16);
    expect([draft.filledCount, draft.requiredCount]).toEqual([16, 16]);
    expect(draft.predictions[0]).toEqual({
      kind: "groupPick",
      group: "3-0",
      cellIndex: 0,
      team: { id: "1", name: "HEROIC" },
    });
  });

  it("показывает прогресс по частично заполненной сетке", () => {
    const firstTeam = STAGE_TEAM_LIST[0];
    const draft = buildStagePredictions(
      setCellTeam(createEmptyStageSelection(), 3, firstTeam?.id ?? ""),
      stageTeams,
    );

    expect([draft.filledCount, draft.requiredCount]).toEqual([1, 16]);
  });

  it("не принимает команду не из пула сетки", () => {
    const playoffOnlyTeam = TEAM_LIST[0];
    const draft = buildStagePredictions(
      setCellTeam(createEmptyStageSelection(), 3, playoffOnlyTeam?.id ?? ""),
      stageTeams,
    );

    expect(draft.filledCount).toBe(0);
  });
});

describe("buildPlayoffPredictions", () => {
  it("считает только матчи и называет незакрытый раунд", () => {
    const draft = buildPlayoffPredictions(
      createInitialState(TEAM_LIST),
      playoffTeams,
    );

    expect([draft.filledCount, draft.requiredCount]).toEqual([0, 8]);
    expect(draft.firstIncompleteRound).toBe("quarter");
  });

  it("собирает 8 матчей (включая матч за 3-е место) и чемпиона", () => {
    const draft = buildPlayoffPredictions(fillPlayoff(), playoffTeams);

    expect([draft.filledCount, draft.requiredCount]).toEqual([8, 8]);
    expect(draft.predictions).toHaveLength(9);
    expect(draft.predictions[8]).toEqual({
      kind: "winner",
      team: { id: "27", name: "Team Spirit" },
    });
  });
});

describe("formatPredictionLines", () => {
  it("для сетки отдаёт строку на группу", () => {
    const draft = buildStagePredictions(fillAllCells(), stageTeams);
    const lines = formatPredictionLines(draft.predictions);

    expect(lines).toHaveLength(6);
    expect(lines[0]).toBe("3-0: HEROIC, Ninjas in Pyjamas");
    expect(lines[5]).toBe("2-3: TYLOO, FlyQuest, Lynn Vision");
  });

  it("для плей-офф отдаёт строку на матч (включая 3-е место)", () => {
    const draft = buildPlayoffPredictions(fillPlayoff(), playoffTeams);
    const lines = formatPredictionLines(draft.predictions);

    expect(lines).toHaveLength(8);
    expect(lines[0]).toBe("Team Spirit 2:0 Team Falcons");
    expect(lines[6]).toBe("Team Spirit 3:1 Natus Vincere");
    expect(lines[7]).toBe("The MongolZ 0:2 FaZe Clan");
  });
});

describe("buildPredictionPayload", () => {
  it("раскладывает строки по полям f1…f8", () => {
    const draft = buildPlayoffPredictions(fillPlayoff(), playoffTeams);
    const payload = buildPredictionPayload(
      createPredictionForm(4, "playoff", draft),
      "123456789",
      "09.10.2026 (12:00)",
    );

    expect(payload.f1).toBe("Team Spirit 2:0 Team Falcons");
    expect(payload.f7).toBe("Team Spirit 3:1 Natus Vincere");
    expect(payload.f8).toBe("The MongolZ 0:2 FaZe Clan");
    expect(payload.step).toBe("4");
    expect(payload.account_number).toBe("123456789");
    expect(payload.time).toBe("09.10.2026 (12:00)");
  });
});

describe("getPredictionValidationError", () => {
  it("для сетки говорит про ячейки", () => {
    const form = createPredictionForm(
      1,
      "stage",
      buildStagePredictions(createEmptyStageSelection(), stageTeams),
    );

    expect(isPredictionFormComplete(form)).toBe(false);
    expect(getPredictionValidationError(form)).toBe(
      "Заполните все ячейки команд (0 из 16)",
    );
  });

  it("для плей-офф говорит про счёт и раунд", () => {
    const form = createPredictionForm(
      4,
      "playoff",
      buildPlayoffPredictions(createInitialState(TEAM_LIST), playoffTeams),
    );

    expect(getPredictionValidationError(form)).toBe(
      "Заполните счёт в матчах 1/4 финала (0 из 8)",
    );
  });

  it("не считает незавершённую серию заполненным матчем", () => {
    let state = setMatchScore(
      createInitialState(TEAM_LIST),
      "quarter",
      0,
      0,
      "1",
    );
    state = setMatchScore(state, "quarter", 0, 1, "1");

    const form = createPredictionForm(
      4,
      "playoff",
      buildPlayoffPredictions(state, playoffTeams),
    );

    expect(getPredictionValidationError(form)).toBe(
      "Заполните счёт в матчах 1/4 финала (0 из 8)",
    );
  });

  it("подсказывает про матч за 3-е место, если заполнены 1/4, 1/2 и финал", () => {
    let state = fillPlayoff();
    state = setMatchScore(state, "thirdPlace", 0, 0, "");
    state = setMatchScore(state, "thirdPlace", 0, 1, "");

    const form = createPredictionForm(
      4,
      "playoff",
      buildPlayoffPredictions(state, playoffTeams),
    );

    expect(getPredictionValidationError(form)).toBe(
      "Заполните счёт в матчах матча за 3-е место (7 из 8)",
    );
  });

  it("для полностью заполненного прогноза возвращает null", () => {
    const form = createPredictionForm(
      4,
      "playoff",
      buildPlayoffPredictions(fillPlayoff(), playoffTeams),
    );

    expect(isPredictionFormComplete(form)).toBe(true);
    expect(getPredictionValidationError(form)).toBeNull();
  });
});

describe("normalizeAccountNumber", () => {
  it("оставляет только цифры и обрезает длину", () => {
    expect(normalizeAccountNumber("12a34.56-")).toBe("123456");
    expect(normalizeAccountNumber("1234567890")).toBe("123456789");
  });

  it("убирает ведущие нули", () => {
    expect(normalizeAccountNumber("00123")).toBe("123");
  });
});

describe("getStageTeamListByStep", () => {
  it("возвращает списки из 16 команд для этапов 1–3", () => {
    expect(STAGE_1_TEAM_LIST).toHaveLength(16);
    expect(STAGE_2_TEAM_LIST).toHaveLength(16);
    expect(STAGE_3_TEAM_LIST).toHaveLength(16);
    expect(getStageTeamListByStep(1)).toBe(STAGE_1_TEAM_LIST);
    expect(getStageTeamListByStep(2)).toBe(STAGE_2_TEAM_LIST);
    expect(getStageTeamListByStep(3)).toBe(STAGE_3_TEAM_LIST);
  });
});
