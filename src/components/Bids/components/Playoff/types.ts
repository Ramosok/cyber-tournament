import type { MatchScore } from "@/components/Bids/components/Playoff/utils/matchScore";
import type { Team, TeamId } from "@/shared/config";
import type {
  BestOf,
  MatchSlot,
  PlayoffRoundKey,
} from "@/shared/tournament/playoffRounds";

/** В слоте матча либо команда, либо пусто (ждём победителя прошлого раунда). */
export type MatchSlotTeam = TeamId | null;

export type MatchTeams = readonly [MatchSlotTeam, MatchSlotTeam];

export type Match = {
  readonly teams: MatchTeams;
  readonly score: MatchScore;
};

export type RoundState = {
  readonly key: PlayoffRoundKey;
  readonly bestOf: BestOf;
  readonly matches: readonly Match[];
};

export type PlayoffRounds = Readonly<Record<PlayoffRoundKey, RoundState>>;

export type PlayoffState = {
  readonly rounds: PlayoffRounds;
  readonly winnerId: MatchSlotTeam;
};

export type PlayoffProps = {
  readonly state: PlayoffState;
  readonly teams: readonly Team[];
  readonly onScoreChange: (
    round: PlayoffRoundKey,
    matchIndex: number,
    slot: MatchSlot,
    value: string,
  ) => void;
};
