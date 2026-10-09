import type { Team } from "@/shared/config";

export function groupBy(
  teams: readonly (Team | null)[],
): Record<string, string[]> {
  const initial: Record<string, string[]> = {};

  return teams.reduce((acc, team) => {
    if (team?.metaData) {
      const key = team.metaData;
      const existingTeams = acc[key] || [];

      return {
        ...acc,
        [key]: [...existingTeams, team.nameTeam],
      };
    }

    return acc;
  }, initial);
}
