import THREEDMAX from "./assets/teamsIcon/3DMAX.webp";
import Astralis from "./assets/teamsIcon/Astralis.webp";
import AuroraGaming from "./assets/teamsIcon/AuroraGaming.webp";
import B8 from "./assets/teamsIcon/B8.webp";
import FaZeClan from "./assets/teamsIcon/FaZeClan.webp";
import Fluxo from "./assets/teamsIcon/Fluxo.webp";
import FlyQuest from "./assets/teamsIcon/FlyQuest.webp";
import Fnatic from "./assets/teamsIcon/Fnatic.webp";
import Furia from "./assets/teamsIcon/Furia.webp";
import G2Esports from "./assets/teamsIcon/G2Esports.webp";
import GamerLegion from "./assets/teamsIcon/GamerLegion.webp";
import ImperialEsports from "./assets/teamsIcon/ImperialEsports.webp";
import Legacy from "./assets/teamsIcon/Legacy.webp";
import LynnVisionGaming from "./assets/teamsIcon/LynnVisionGaming.webp";
import M80 from "./assets/teamsIcon/M80.webp";
import MIBR from "./assets/teamsIcon/MIBR.webp";
import MOUZ from "./assets/teamsIcon/MOUZ.webp";
import NatusVincere from "./assets/teamsIcon/NatusVincere.webp";
import NinjasInPyjamas from "./assets/teamsIcon/NinjasInPyjamas.webp";
import NRG from "./assets/teamsIcon/NRG.webp";
import paiNGaming from "./assets/teamsIcon/paiNGaming.webp";
import PARIVISION from "./assets/teamsIcon/PARIVISION.webp";
import PassionUA from "./assets/teamsIcon/PassionUA.webp";
import RareAtom from "./assets/teamsIcon/RareAtom.webp";
import REDCanids from "./assets/teamsIcon/REDCanids.webp";
import TeamFalcons from "./assets/teamsIcon/TeamFalcons.webp";
import TeamLiquid from "./assets/teamsIcon/TeamLiquid.webp";
import TeamSpirit from "./assets/teamsIcon/TeamSpirit.webp";
import TeamVitality from "./assets/teamsIcon/TeamVitality.webp";
import TheHunsEsports from "./assets/teamsIcon/TheHunsEsports.webp";
import TheMongolZ from "./assets/teamsIcon/TheMongolZ.webp";
import TYLOO from "./assets/teamsIcon/TYLOO.webp";

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

/** Команды, покинувшие турнир (справочно, в интерфейсе не используются). */
export const TEAM_LIST_ELIMINATED: readonly Team[] = [
  { logo: NRG, nameTeam: "NRG", id: "19" },
  { logo: TheHunsEsports, nameTeam: "The Huns Esports", id: "29" },
  { logo: REDCanids, nameTeam: "RED Canids", id: "24" },
  { logo: LynnVisionGaming, nameTeam: "Lynn Vision Gaming", id: "13" },
  { logo: GamerLegion, nameTeam: "GamerLegion", id: "10" },
  { logo: RareAtom, nameTeam: "Rare Atom", id: "23" },
  { logo: Legacy, nameTeam: "Legacy", id: "12" },
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
