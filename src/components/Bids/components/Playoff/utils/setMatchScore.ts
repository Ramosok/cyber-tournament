import type {
  Match,
  MatchSlotTeam,
  MatchTeams,
  PlayoffState,
  RoundState,
} from "@/components/Bids/components/Playoff/types";
import type {
  MatchSlot,
  PlayoffRoundKey,
} from "@/shared/tournament/playoffRounds";

import {
  createEmptyScore,
  getWinnerSlot,
} from "@/components/Bids/components/Playoff/utils/matchScore";

/** Команда, выигравшая матч, либо null, если серия ещё не сыграна. */
export const getMatchWinner = (
  match: Match,
  bestOf: RoundState["bestOf"],
): MatchSlotTeam => {
  const winnerSlot = getWinnerSlot(match.score, bestOf);

  return winnerSlot === null ? null : match.teams[winnerSlot];
};

/** Проигравшая команда пары (для посева в матч за 3-е место) либо null. */
export const getMatchLoser = (
  match: Match,
  bestOf: RoundState["bestOf"],
): MatchSlotTeam => {
  const winnerSlot = getWinnerSlot(match.score, bestOf);

  if (winnerSlot === null) {
    return null;
  }

  const loserSlot: MatchSlot = winnerSlot === 0 ? 1 : 0;

  return match.teams[loserSlot];
};

const replaceTeams = (
  teams: MatchTeams,
  slot: MatchSlot,
  teamId: MatchSlotTeam,
): MatchTeams => (slot === 0 ? [teamId, teams[1]] : [teams[0], teamId]);

const replaceMatch = (
  round: RoundState,
  matchIndex: number,
  patch: (match: Match) => Match,
): RoundState => ({
  ...round,
  matches: round.matches.map((match, index) =>
    index === matchIndex ? patch(match) : match,
  ),
});

const clearRound = (round: RoundState): RoundState => ({
  ...round,
  matches: round.matches.map(() => ({
    teams: [null, null] satisfies MatchTeams,
    score: createEmptyScore(),
  })),
});

/**
 * Единственная точка изменения сетки: записывает счёт матча, продвигает
 * победителя в следующий раунд (а проигравших в 1/2 — в матч за 3-е место)
 * и сбрасывает зависимые от него матчи.
 * Возвращает новое состояние — мутировать переданное нельзя.
 */
export const setMatchScore = (
  state: PlayoffState,
  roundKey: PlayoffRoundKey,
  matchIndex: number,
  slot: MatchSlot,
  value: string,
): PlayoffState => {
  const round = state.rounds[roundKey];
  const match = round.matches[matchIndex];

  if (!match) {
    return state;
  }

  const updatedMatch: Match = {
    ...match,
    score:
      slot === 0
        ? { ...match.score, team1: value }
        : { ...match.score, team2: value },
  };

  const winnerId = getMatchWinner(updatedMatch, round.bestOf);

  const rounds = {
    ...state.rounds,
    [roundKey]: replaceMatch(round, matchIndex, () => updatedMatch),
  };

  switch (roundKey) {
    case "quarter": {
      const semiSlot: MatchSlot = matchIndex % 2 === 0 ? 0 : 1;

      return {
        rounds: {
          ...rounds,
          semi: replaceMatch(
            state.rounds.semi,
            Math.floor(matchIndex / 2),
            (semiMatch) => ({
              teams: replaceTeams(semiMatch.teams, semiSlot, winnerId),
              score: createEmptyScore(),
            }),
          ),
          final: clearRound(state.rounds.final),
          thirdPlace: clearRound(state.rounds.thirdPlace),
        },
        winnerId: null,
      };
    }

    case "semi": {
      const targetSlot: MatchSlot = matchIndex === 0 ? 0 : 1;
      const loserId = getMatchLoser(updatedMatch, round.bestOf);

      return {
        rounds: {
          ...rounds,
          final: replaceMatch(state.rounds.final, 0, (finalMatch) => ({
            teams: replaceTeams(finalMatch.teams, targetSlot, winnerId),
            score: createEmptyScore(),
          })),
          thirdPlace: replaceMatch(
            state.rounds.thirdPlace,
            0,
            (thirdPlaceMatch) => ({
              teams: replaceTeams(thirdPlaceMatch.teams, targetSlot, loserId),
              score: createEmptyScore(),
            }),
          ),
        },
        winnerId: null,
      };
    }

    case "final":
      return { rounds, winnerId };

    case "thirdPlace":
      return { rounds, winnerId: state.winnerId };
  }
};
