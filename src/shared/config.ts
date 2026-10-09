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
//=======================================================================================
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

export type Team = {
  logo: string;
  nameTeam: string;
  id: `${string}`;
  isSelected: boolean;
  metaData?: "3-0" | "0-3" | "3-1" | "3-2" | "1-3" | "2-3" | undefined;
};

export const CELL_LABEL_MAP: Record<
  number,
  Exclude<Team["metaData"], undefined>
> = {
  0: "3-0",
  1: "3-0",
  2: "0-3",
  3: "0-3",
  4: "3-1",
  5: "3-1",
  6: "3-1",
  7: "3-2",
  8: "3-2",
  9: "3-2",
  10: "1-3",
  11: "1-3",
  12: "1-3",
  13: "2-3",
  14: "2-3",
  15: "2-3",
};

export const TEAM_LIST: Team[] = [
  {
    logo: TeamSpirit,
    nameTeam: "Team Spirit",
    id: "27",
    isSelected: false,
  },
  {
    logo: TeamFalcons,
    nameTeam: "Team Falcons",
    id: "25",
    isSelected: false,
  },
  {
    logo: TheMongolZ,
    nameTeam: "The MongolZ",
    id: "30",
    isSelected: false,
  },
  {
    logo: TeamVitality,
    nameTeam: "Team Vitality",
    id: "28",
    isSelected: false,
  },
  {
    logo: MOUZ,
    nameTeam: "MOUZ",
    id: "16",
    isSelected: false,
  },
  {
    logo: FaZeClan,
    nameTeam: "FaZe Clan",
    id: "5",
    isSelected: false,
  },
  {
    logo: NatusVincere,
    nameTeam: "Natus Vincere",
    id: "17",
    isSelected: false,
  },
  {
    logo: Furia,
    nameTeam: "Furia",
    id: "1",
    isSelected: false,
  },
];

export const TEAM_LIST_ROUND_2_LUSER: Team[] = [
  {
    logo: paiNGaming,
    nameTeam: "paiN Gaming",
    id: "20",
    isSelected: false,
  },
  {
    logo: G2Esports,
    nameTeam: "G2 Esports",
    id: "9",
    isSelected: false,
  },
  {
    logo: B8,
    nameTeam: "B8",
    id: "4",
    isSelected: false,
  },
  {
    logo: ImperialEsports,
    nameTeam: "Imperial Esports",
    id: "11",
    isSelected: false,
  },
  {
    logo: PARIVISION,
    nameTeam: "PARIVISION",
    id: "21",
    isSelected: false,
  },
  {
    logo: TeamLiquid,
    nameTeam: "Team Liquid",
    id: "26",
    isSelected: false,
  },
  {
    logo: PassionUA,
    nameTeam: "Passion UA",
    id: "22",
    isSelected: false,
  },

  {
    logo: THREEDMAX,
    nameTeam: "3DMAX",
    id: "2",
    isSelected: false,
  },
  {
    logo: AuroraGaming,
    nameTeam: "Aurora Gaming",
    id: "3",
    isSelected: false,
  },

  {
    logo: Astralis,
    nameTeam: "Astralis",
    id: "32",
    isSelected: false,
  },
  {
    logo: TYLOO,
    nameTeam: "TYLOO",
    id: "31",
    isSelected: false,
  },
  {
    logo: MIBR,
    nameTeam: "MIBR",
    id: "15",
    isSelected: false,
  },

  {
    logo: M80,
    nameTeam: "M80",
    id: "14",
    isSelected: false,
  },
  {
    logo: FlyQuest,
    nameTeam: "FlyQuest",
    id: "7",
    isSelected: false,
  },
  {
    logo: Fnatic,
    nameTeam: "Fnatic",
    id: "8",
    isSelected: false,
  },
  {
    logo: NinjasInPyjamas,
    nameTeam: "Ninjas in Pyjamas",
    id: "18",
    isSelected: false,
  },
];

export const LUSERS_LIST = [
  {
    logo: NRG,
    nameTeam: "NRG",
    id: "19",
    isSelected: false,
  },
  {
    logo: TheHunsEsports,
    nameTeam: "The Huns Esports",
    id: "29",
    isSelected: false,
  },
  {
    logo: REDCanids,
    nameTeam: "RED Canids",
    id: "24",
    isSelected: false,
  },
  {
    logo: LynnVisionGaming,
    nameTeam: "Lynn Vision Gaming",
    id: "13",
    isSelected: false,
  },
  {
    logo: GamerLegion,
    nameTeam: "GamerLegion",
    id: "10",
    isSelected: false,
  },

  {
    logo: RareAtom,
    nameTeam: "Rare Atom",
    id: "23",
    isSelected: false,
  },
  {
    logo: Legacy,
    nameTeam: "Legacy",
    id: "12",
    isSelected: false,
  },
  {
    logo: FaZeClan,
    nameTeam: "FaZe Clan",
    id: "5",
    isSelected: false,
  },
  {
    logo: Fluxo,
    nameTeam: "Fluxo",
    id: "6",
    isSelected: false,
  },
];
