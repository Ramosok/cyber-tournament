import type { BettingStatus } from "@/shared/utils/getCurrentBettingEndDate";

import { BASE_URL } from "@/components/AccountNumberForm/api/config";
import { getDateAndTime } from "@/components/AccountNumberForm/utils/getDateAndTime";
//import { groupBy } from "@/components/AccountNumberForm/utils/groupBy";
import { getCurrentBettingEndDate } from "@/shared/utils/getCurrentBettingEndDate";

export type PredictionPayload = {
  account_number: string;
  time: string;
  f1: string;
  f2: string;
  f3: string;
  f4: string;
  f5: string;
  f6: string;
  f7: string;
  step: string;
};

export type PredictionActionState = {
  status: "idle" | "pending" | "success" | "error";
  error?: string;
};

export type PlayOffTeams = {
  matchIndex: number;
  round: string;
  teamName?: string;
  team1Name: string;
  team1Score: number;
  team2Name: string;
  team2Score: number;
  type: string;
};

export async function submitPrediction(
  _prevState: PredictionActionState,
  formData: FormData,
  teamList: PlayOffTeams[],
): Promise<PredictionActionState> {
  const rawAccount = formData.get("accountNumber");
  const accountNumber = typeof rawAccount === "string" ? rawAccount.trim() : "";

  const bettingStatus: BettingStatus = getCurrentBettingEndDate();
  const currentStep = bettingStatus.currentTour;

  if (!accountNumber) {
    return {
      status: "error",
      error: "Укажите номер игрового счёта",
    };
  }

  // if (currentStep < 4) {
  //   const selectedTeams = teamList.some((t): t is Team => Boolean(t?.metaData));
  //
  if (teamList.length < 7) {
    return {
      status: "error",
      error: "Заполните все ячейки команд",
    };
  }
  // }

  // const groupTeams = groupBy(teamList);

  const payload: PredictionPayload = {
    time: getDateAndTime(),
    account_number: accountNumber,
    f1: `${teamList[0].team1Name} ${teamList[0].team1Score}:${teamList[0].team2Score} ${teamList[0].team2Name}`,
    f2: `${teamList[1].team1Name} ${teamList[1].team1Score}:${teamList[1].team2Score} ${teamList[1].team2Name}`,
    f3: `${teamList[2].team1Name} ${teamList[2].team1Score}:${teamList[2].team2Score} ${teamList[2].team2Name}`,
    f4: `${teamList[3].team1Name} ${teamList[3].team1Score}:${teamList[3].team2Score} ${teamList[3].team2Name}`,
    f5: `${teamList[4].team1Name} ${teamList[4].team1Score}:${teamList[4].team2Score} ${teamList[4].team2Name}`,
    f6: `${teamList[5].team1Name} ${teamList[5].team1Score}:${teamList[5].team2Score} ${teamList[5].team2Name}`,
    f7: `${teamList[6].team1Name} ${teamList[6].team1Score}:${teamList[6].team2Score} ${teamList[6].team2Name}`,
    step: String(currentStep),
  };

  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      body: new URLSearchParams({ ...payload }).toString(),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return {
        status: "error",
        error: text || `Ошибка отправки (${res.status})`,
      };
    }

    return { status: "success" };
  } catch (e) {
    console.error(e);
    return { status: "error", error: "Не удалось отправить данные" };
  }
}
