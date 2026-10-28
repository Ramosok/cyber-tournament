import Onewin from "./assets/teamsIcon/1win.webp";
import NineZ from "./assets/teamsIcon/9z.webp";
import HundredThieves from "./assets/teamsIcon/100Thieves.webp";
import Astralis from "./assets/teamsIcon/Astralis.webp";
import Aurora from "./assets/teamsIcon/AuroraGaming.webp";
import B8 from "./assets/teamsIcon/B8.webp";
import BCGame from "./assets/teamsIcon/BCGame.webp";
import BETBOOM from "./assets/teamsIcon/BETBOOM.webp";
import DENDELE from "./assets/teamsIcon/DENDELE.webp";
import FaZe from "./assets/teamsIcon/FaZeClan.webp";
import FlyQuest from "./assets/teamsIcon/FlyQuest.webp";
import FURIA from "./assets/teamsIcon/Furia.webp";
import FUT from "./assets/teamsIcon/FUT.webp";
import G2 from "./assets/teamsIcon/G2Esports.webp";
import HEROIC from "./assets/teamsIcon/HEROIC.webp";
import Imperial from "./assets/teamsIcon/ImperialEsports.webp";
import Legacy from "./assets/teamsIcon/Legacy.webp";
import LynnVision from "./assets/teamsIcon/LynnVisionGaming.webp";
import M80 from "./assets/teamsIcon/M80.webp";
import MIBR from "./assets/teamsIcon/MIBR.webp";
import MOUZ from "./assets/teamsIcon/MOUZ.webp";
import NatusVincere from "./assets/teamsIcon/NatusVincere.webp";
import Nemiga from "./assets/teamsIcon/Nemiga.webp";
import NinjasInPyjamas from "./assets/teamsIcon/NinjasInPyjamas.webp";
import PARIVISION from "./assets/teamsIcon/PARIVISION.webp";
import TBD from "./assets/teamsIcon/TBD.webp";
import Falcons from "./assets/teamsIcon/TeamFalcons.webp";
import Liquid from "./assets/teamsIcon/TeamLiquid.webp";
import Spirit from "./assets/teamsIcon/TeamSpirit.webp";
import Vitality from "./assets/teamsIcon/TeamVitality.webp";
import TheMongolZ from "./assets/teamsIcon/TheMongolZ.webp";
import TYLOO from "./assets/teamsIcon/TYLOO.webp";
import Wildcard from "./assets/teamsIcon/Wildcard.webp";

export type TeamId = string;

export type Team = {
  readonly id: TeamId;
  readonly nameTeam: string;
  readonly logo: string;
};

export const TEAM_LIST: readonly Team[] = [
  { logo: Spirit, nameTeam: "Team Spirit", id: "27" },
  { logo: Falcons, nameTeam: "Team Falcons", id: "25" },
  { logo: TheMongolZ, nameTeam: "The MongolZ", id: "30" },
  { logo: Vitality, nameTeam: "Team Vitality", id: "28" },
  { logo: MOUZ, nameTeam: "MOUZ", id: "16" },
  { logo: FaZe, nameTeam: "FaZe Clan", id: "5" },
  { logo: NatusVincere, nameTeam: "Natus Vincere", id: "17" },
  { logo: FURIA, nameTeam: "Furia", id: "1" },
];

export const STAGE_1_TEAM_LIST: readonly Team[] = [
  { logo: HEROIC, nameTeam: "HEROIC", id: "1" },
  { logo: NinjasInPyjamas, nameTeam: "Ninjas in Pyjamas", id: "2" },
  { logo: FaZe, nameTeam: "FaZe", id: "3" },
  { logo: Onewin, nameTeam: "1win", id: "4" },
  { logo: HundredThieves, nameTeam: "100 Thieves", id: "5" },
  { logo: B8, nameTeam: "B8", id: "6" },
  { logo: M80, nameTeam: "M80", id: "7" },
  { logo: DENDELE, nameTeam: "DENDELE", id: "8" },
  { logo: NineZ, nameTeam: "9z", id: "9" },
  { logo: Imperial, nameTeam: "Imperial", id: "10" },
  { logo: Liquid, nameTeam: "Liquid", id: "11" },
  { logo: Wildcard, nameTeam: "Wildcard", id: "12" },
  { logo: BCGame, nameTeam: "BC.Game", id: "13" },
  { logo: TYLOO, nameTeam: "TYLOO", id: "14" },
  { logo: FlyQuest, nameTeam: "FlyQuest", id: "15" },
  { logo: LynnVision, nameTeam: "Lynn Vision", id: "16" },
];

export const STAGE_2_TEAM_LIST: readonly Team[] = [
  { logo: G2, nameTeam: "G2", id: "1" },
  { logo: NatusVincere, nameTeam: "Natus Vincere", id: "2" },
  { logo: Astralis, nameTeam: "Astralis", id: "3" },
  { logo: PARIVISION, nameTeam: "PARIVISION", id: "4" },
  { logo: Nemiga, nameTeam: "Nemiga", id: "5" },
  { logo: Falcons, nameTeam: "Falcons", id: "6" },
  { logo: MIBR, nameTeam: "MIBR", id: "7" },
  { logo: TheMongolZ, nameTeam: "The MongolZ", id: "8" },
  { logo: TBD, nameTeam: "TBD 1", id: "9" },
  { logo: TBD, nameTeam: "TBD 2", id: "10" },
  { logo: TBD, nameTeam: "TBD 3", id: "11" },
  { logo: TBD, nameTeam: "TBD 4", id: "12" },
  { logo: TBD, nameTeam: "TBD 5", id: "13" },
  { logo: TBD, nameTeam: "TBD 6", id: "14" },
  { logo: TBD, nameTeam: "TBD 7", id: "15" },
  { logo: TBD, nameTeam: "TBD 8", id: "16" },
];

export const STAGE_3_TEAM_LIST: readonly Team[] = [
  { logo: Vitality, nameTeam: "Vitality", id: "1" },
  { logo: MOUZ, nameTeam: "MOUZ", id: "2" },
  { logo: Spirit, nameTeam: "Spirit", id: "3" },
  { logo: Aurora, nameTeam: "Aurora", id: "4" },
  { logo: BETBOOM, nameTeam: "BETBOOM", id: "5" },
  { logo: FUT, nameTeam: "FUT", id: "6" },
  { logo: FURIA, nameTeam: "FURIA", id: "7" },
  { logo: Legacy, nameTeam: "Legacy", id: "8" },
  { logo: TBD, nameTeam: "TBD 1", id: "9" },
  { logo: TBD, nameTeam: "TBD 2", id: "10" },
  { logo: TBD, nameTeam: "TBD 3", id: "11" },
  { logo: TBD, nameTeam: "TBD 4", id: "12" },
  { logo: TBD, nameTeam: "TBD 5", id: "13" },
  { logo: TBD, nameTeam: "TBD 6", id: "14" },
  { logo: TBD, nameTeam: "TBD 7", id: "15" },
  { logo: TBD, nameTeam: "TBD 8", id: "16" },
];

export const STAGE_TEAM_LIST: readonly Team[] = STAGE_1_TEAM_LIST;

const STAGE_2_STEP = 2;
const STAGE_3_STEP = 3;

export const getStageTeamListByStep = (step: number): readonly Team[] => {
  if (step === STAGE_2_STEP) {
    return STAGE_2_TEAM_LIST;
  }

  if (step === STAGE_3_STEP) {
    return STAGE_3_TEAM_LIST;
  }

  return STAGE_1_TEAM_LIST;
};

const teamIndexCache = new WeakMap<
  readonly Team[],
  ReadonlyMap<TeamId, Team>
>();

export const createTeamIndex = (
  teams: readonly Team[],
): ReadonlyMap<TeamId, Team> => {
  const cached = teamIndexCache.get(teams);

  if (cached) {
    return cached;
  }

  const index = new Map(teams.map((team) => [team.id, team]));
  teamIndexCache.set(teams, index);

  return index;
};

export const getTeamById = (
  teams: ReadonlyMap<TeamId, Team>,
  id: TeamId | null,
): Team | null => (id === null ? null : (teams.get(id) ?? null));
