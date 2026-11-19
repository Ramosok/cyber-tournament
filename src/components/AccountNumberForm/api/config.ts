import type { StepNumber } from "@/shared/tournament/bettingStatus";

export const BASE_URL =
  "https://script.google.com/macros/s/AKfycbxDvpW3WSqyuI3XEOAZClOvUILK3EhDguCOoMt_1dn4g0vk2QmPLE6N1EkSU_7QPTJP-w/exec";

export const STAGE_SPREADSHEET_URLS: Readonly<Record<StepNumber, string>> = {
  1: "https://docs.google.com/spreadsheets/d/1yEW2fCOmHdTIExshkgFpa749Rlb68C9yEVvjtglxssc/edit?gid=0#gid=0",
  2: "https://docs.google.com/spreadsheets/d/1yEW2fCOmHdTIExshkgFpa749Rlb68C9yEVvjtglxssc/edit?gid=1821488892#gid=1821488892",
  3: "https://docs.google.com/spreadsheets/d/1yEW2fCOmHdTIExshkgFpa749Rlb68C9yEVvjtglxssc/edit?gid=362143462#gid=362143462",
  4: "https://docs.google.com/spreadsheets/d/1yEW2fCOmHdTIExshkgFpa749Rlb68C9yEVvjtglxssc/edit?gid=1951409102#gid=1951409102",
};
