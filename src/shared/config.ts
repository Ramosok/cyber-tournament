import THREEDMAX from "./assets/teamsIcon/3DMAX.svg";
import Astralis from "./assets/teamsIcon/Astralis.svg";
import AuroraGaming from "./assets/teamsIcon/AuroraGaming.svg";
import B8 from "./assets/teamsIcon/B8.svg";
import FaZeClan from "./assets/teamsIcon/FaZeClan.svg";
import Fluxo from "./assets/teamsIcon/Fluxo.svg";
import FlyQuest from "./assets/teamsIcon/FlyQuest.svg";
import Fnatic from "./assets/teamsIcon/Fnatic.svg";
import Furia from "./assets/teamsIcon/Furia.svg";
import G2Esports from "./assets/teamsIcon/G2Esports.svg";
import GamerLegion from "./assets/teamsIcon/GamerLegion.svg";
import ImperialEsports from "./assets/teamsIcon/ImperialEsports.svg";
import Legacy from "./assets/teamsIcon/Legacy.svg";
import LynnVisionGaming from "./assets/teamsIcon/LynnVisionGaming.svg";
import M80 from "./assets/teamsIcon/M80.svg";
import MIBR from "./assets/teamsIcon/MIBR.svg";
import MOUZ from "./assets/teamsIcon/MOUZ.svg";
import NatusVincere from "./assets/teamsIcon/NatusVincere.svg";
import NinjasInPyjamas from "./assets/teamsIcon/NinjasInPyjamas.svg";
import NRG from "./assets/teamsIcon/NRG.svg";
import paiNGaming from "./assets/teamsIcon/paiNGaming.svg";
import PARIVISION from "./assets/teamsIcon/PARIVISION.svg";
import PassionUA from "./assets/teamsIcon/PassionUA.svg";
import RareAtom from "./assets/teamsIcon/RareAtom.svg";
import REDCanids from "./assets/teamsIcon/REDCanids.svg";
import TeamFalcons from "./assets/teamsIcon/TeamFalcons.svg";
import TeamLiquid from "./assets/teamsIcon/TeamLiquid.svg";
import TeamSpirit from "./assets/teamsIcon/TeamSpirit.svg";
import TeamVitality from "./assets/teamsIcon/TeamVitality.svg";
import TheHunsEsports from "./assets/teamsIcon/TheHunsEsports.svg";
import TheMongolZ from "./assets/teamsIcon/TheMongolZ.svg";
import TYLOO from "./assets/teamsIcon/TYLOO.svg";

/** Идентификатор команды во внешней системе (строка, а не индекс массива). */
export type TeamId = string;

export type Team = {
  readonly id: TeamId;
  readonly nameTeam: string;
  readonly logo: string;
};

/** Команды, прошедшие в плей-офф (сетка 1/4 финала). */
export const TEAM_LIST: readonly Team[] = [
  { logo: TeamSpirit, nameTeam: "Team Spirit", id: "27" },
  { logo: TeamFalcons, nameTeam: "Team Falcons", id: "25" },
  { logo: TheMongolZ, nameTeam: "The MongolZ", id: "30" },
  { logo: TeamVitality, nameTeam: "Team Vitality", id: "28" },
  { logo: MOUZ, nameTeam: "MOUZ", id: "16" },
  { logo: FaZeClan, nameTeam: "FaZe Clan", id: "5" },
  { logo: NatusVincere, nameTeam: "Natus Vincere", id: "17" },
  { logo: Furia, nameTeam: "Furia", id: "1" },
];

/** Команды, вышедшие во второй раунд из нижней сетки. */
export const TEAM_LIST_ROUND_2_LOSERS: readonly Team[] = [
  { logo: paiNGaming, nameTeam: "paiN Gaming", id: "20" },
  { logo: G2Esports, nameTeam: "G2 Esports", id: "9" },
  { logo: B8, nameTeam: "B8", id: "4" },
  { logo: ImperialEsports, nameTeam: "Imperial Esports", id: "11" },
  { logo: PARIVISION, nameTeam: "PARIVISION", id: "21" },
  { logo: TeamLiquid, nameTeam: "Team Liquid", id: "26" },
  { logo: PassionUA, nameTeam: "Passion UA", id: "22" },
  { logo: THREEDMAX, nameTeam: "3DMAX", id: "2" },
  { logo: AuroraGaming, nameTeam: "Aurora Gaming", id: "3" },
  { logo: Astralis, nameTeam: "Astralis", id: "32" },
  { logo: TYLOO, nameTeam: "TYLOO", id: "31" },
  { logo: MIBR, nameTeam: "MIBR", id: "15" },
  { logo: M80, nameTeam: "M80", id: "14" },
  { logo: FlyQuest, nameTeam: "FlyQuest", id: "7" },
  { logo: Fnatic, nameTeam: "Fnatic", id: "8" },
  { logo: NinjasInPyjamas, nameTeam: "Ninjas in Pyjamas", id: "18" },
];

/** Команды, покинувшие турнир. */
export const TEAM_LIST_ELIMINATED: readonly Team[] = [
  { logo: NRG, nameTeam: "NRG", id: "19" },
  { logo: TheHunsEsports, nameTeam: "The Huns Esports", id: "29" },
  { logo: REDCanids, nameTeam: "RED Canids", id: "24" },
  { logo: LynnVisionGaming, nameTeam: "Lynn Vision Gaming", id: "13" },
  { logo: GamerLegion, nameTeam: "GamerLegion", id: "10" },
  { logo: RareAtom, nameTeam: "Rare Atom", id: "23" },
  { logo: Legacy, nameTeam: "Legacy", id: "12" },
  { logo: FaZeClan, nameTeam: "FaZe Clan", id: "5" },
  { logo: Fluxo, nameTeam: "Fluxo", id: "6" },
];

/**
 * Пул для выбора в общую сетку на этапах 1–3: 16 команд = 16 ячеек.
 * Чтобы поменять состав, достаточно заменить этот список.
 */
export const STAGE_TEAM_LIST: readonly Team[] = TEAM_LIST_ROUND_2_LOSERS;

/** Быстрый поиск команды по id (вместо линейного `find` на каждый рендер). */
export const createTeamIndex = (
  teams: readonly Team[],
): ReadonlyMap<TeamId, Team> => new Map(teams.map((team) => [team.id, team]));

export const getTeamById = (
  teams: ReadonlyMap<TeamId, Team>,
  id: TeamId | null,
): Team | null => (id === null ? null : (teams.get(id) ?? null));
