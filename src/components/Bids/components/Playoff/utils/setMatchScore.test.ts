import { describe, expect, it } from "vitest";

import type { PlayoffState } from "@/components/Bids/components/Playoff/types";
import type { PlayoffRoundKey } from "@/shared/tournament/playoffRounds";

import { createInitialState } from "@/components/Bids/components/Playoff/utils/createInitialState";
import { setMatchScore } from "@/components/Bids/components/Playoff/utils/setMatchScore";
import { createTeamIndex, TEAM_LIST } from "@/shared/config";

const teams = createTeamIndex(TEAM_LIST);
const SPIRIT = "Team Spirit";

const namesOf = (
  state: PlayoffState,
  round: PlayoffRoundKey,
  index: number,
): (string | null)[] =>
  state.rounds[round].matches[index]?.teams.map(
    (id) => (id === null ? null : teams.get(id)?.nameTeam) ?? null,
  );

const fill = (
  state: PlayoffState,
  round: PlayoffRoundKey,
  matchIndex: number,
  score1: number,
  score2: number,
): PlayoffState => {
  const withFirst = setMatchScore(state, round, matchIndex, 0, String(score1));

  return setMatchScore(withFirst, round, matchIndex, 1, String(score2));
};

describe("createInitialState", () => {
  it("сеет 1/4 финала соседними парами из списка команд", () => {
    const state = createInitialState(TEAM_LIST);

    expect(state.rounds.quarter.matches).toHaveLength(4);
    expect(state.rounds.semi.matches).toHaveLength(2);
    expect(state.rounds.final.matches).toHaveLength(1);
    expect(namesOf(state, "quarter", 0)).toEqual([SPIRIT, "Team Falcons"]);
    expect(state.winnerId).toBeNull();
  });
});

describe("setMatchScore", () => {
  it("не продвигает команду, пока серия не сыграна", () => {
    const state = setMatchScore(
      createInitialState(TEAM_LIST),
      "quarter",
      0,
      0,
      "2",
    );

    expect(state.rounds.quarter.matches[0]?.score.team1).toBe("2");
    expect(state.rounds.semi.matches[0]?.teams[0]).toBeNull();
  });

  it("продвигает победителя пары в 1/2 финала", () => {
    const state = fill(createInitialState(TEAM_LIST), "quarter", 0, 2, 0);

    expect(namesOf(state, "semi", 0)).toEqual([SPIRIT, null]);
  });

  it("продвигает победителей до финала и определяет чемпиона", () => {
    let state = createInitialState(TEAM_LIST);
    state = fill(state, "quarter", 0, 2, 0);
    state = fill(state, "quarter", 1, 2, 1);
    state = fill(state, "quarter", 2, 0, 2);
    state = fill(state, "quarter", 3, 2, 0);

    expect(namesOf(state, "semi", 0)).toEqual([SPIRIT, "The MongolZ"]);
    expect(namesOf(state, "semi", 1)).toEqual(["FaZe Clan", "Natus Vincere"]);

    state = fill(state, "semi", 0, 2, 0);
    state = fill(state, "semi", 1, 1, 2);

    expect(namesOf(state, "final", 0)).toEqual([SPIRIT, "Natus Vincere"]);
    expect(state.winnerId).toBeNull();

    state = fill(state, "final", 0, 3, 1);

    expect(teams.get(state.winnerId ?? "")?.nameTeam).toBe(SPIRIT);
  });

  it("сбрасывает зависимые раунды при изменении счёта в 1/4", () => {
    let state = createInitialState(TEAM_LIST);
    state = fill(state, "quarter", 0, 2, 0);
    state = fill(state, "quarter", 1, 2, 1);
    state = fill(state, "semi", 0, 2, 0);

    const changed = setMatchScore(state, "quarter", 0, 0, "1");

    expect(changed.rounds.semi.matches[0]?.teams).toEqual([null, "30"]);
    expect(changed.rounds.semi.matches[0]?.score).toEqual({
      team1: "",
      team2: "",
    });
    expect(changed.rounds.final.matches[0]?.teams).toEqual([null, null]);
    expect(changed.winnerId).toBeNull();
  });

  it("не мутирует переданное состояние", () => {
    const state = createInitialState(TEAM_LIST);
    const snapshot = JSON.stringify(state);

    setMatchScore(state, "quarter", 0, 0, "2");

    expect(JSON.stringify(state)).toBe(snapshot);
  });
});
