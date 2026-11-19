import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { AccountNumberForm } from "@/components/AccountNumberForm";
import { TournamentConditions } from "@/components/AccountNumberForm/components/TournamentConditions";
import { Cell } from "@/components/Bids/components/Cell";
import { Playoff } from "@/components/Bids/components/Playoff";
import { createInitialState } from "@/components/Bids/components/Playoff/utils/createInitialState";
import { Steps } from "@/components/Steps";
import { TEAM_LIST } from "@/shared/config";
import { createPredictionForm } from "@/shared/prediction/types";
import { Modal } from "@/shared/ui/Modal/Modal";

const noop = (): void => undefined;

afterEach(() => {
  cleanup();
});

describe("доступная разметка", () => {
  it("диалог получает доступное имя", () => {
    const { container } = render(
      <Modal ariaLabel="Выбор команды">
        <p>содержимое</p>
      </Modal>,
    );

    expect(container.querySelector("dialog")?.getAttribute("aria-label")).toBe(
      "Выбор команды",
    );
  });

  it("условия турнира показываются в диалоге без PDF и содержат ссылку на таблицу", () => {
    const spreadsheetUrl =
      "https://docs.google.com/spreadsheets/d/1yEW2fCOmHdTIExshkgFpa749Rlb68C9yEVvjtglxssc/edit?gid=0#gid=0";
    const { container } = render(
      <TournamentConditions spreadsheetUrl={spreadsheetUrl} />,
    );

    expect(container.querySelector("iframe")).toBeNull();
    expect(container.textContent).toContain(
      "Турнир прогнозистов пройдет в 4 тура:",
    );
    const spreadsheetLinks = container.querySelectorAll(
      `a[href="${spreadsheetUrl}"]`,
    );
    expect(spreadsheetLinks).toHaveLength(2);
    expect(spreadsheetLinks[0]?.textContent).toBe("ЗДЕСЬ");
  });

  it("ячейка с командой: логотип с alt и async-декодированием", () => {
    const team = TEAM_LIST[0];
    const { container } = render(
      <Cell label="3-0" team={team} onClick={noop} />,
    );
    const img = container.querySelector("img");

    expect(img?.getAttribute("alt")).toBe(team?.nameTeam);
    expect(img?.getAttribute("decoding")).toBe("async");
  });

  it("пустая ячейка: кнопка с понятным aria-label", () => {
    const { container } = render(
      <Cell label="3-0" team={null} onClick={noop} />,
    );

    expect(
      container.querySelector("button")?.getAttribute("aria-label"),
    ).toContain("3-0");
  });

  it("степпер отображает все 4 этапа", () => {
    const { container } = render(<Steps />);
    const text = container.textContent ?? "";

    expect(text).toContain("1 ЭТАП");
    expect(text).toContain("2 ЭТАП");
    expect(text).toContain("3 ЭТАП");
    expect(text).toContain("Плей-офф");
  });

  it("плей-офф отображает 1/4, 1/2, ФИНАЛ, 3-Е МЕСТО и ПОБЕДИТЕЛЬ", () => {
    const { container } = render(
      <Playoff
        state={createInitialState(TEAM_LIST)}
        teams={TEAM_LIST}
        onScoreChange={noop}
      />,
    );
    const text = container.textContent ?? "";

    expect(text).toContain("1/4");
    expect(text).toContain("1/2");
    expect(text).toContain("ФИНАЛ");
    expect(text).toContain("3-Е МЕСТО");
    expect(text).toContain("ПОБЕДИТЕЛЬ");
  });

  it("форма отображает 'Условия турнира' и ссылку 'Посмотреть мой прогноз' с url вкладки этапа", () => {
    const stage1Form = createPredictionForm(1, "stage", {
      predictions: [],
      filledCount: 0,
      requiredCount: 16,
    });
    const { container, rerender } = render(
      <AccountNumberForm form={stage1Form} onReset={noop} />,
    );

    const conditionsBtn = Array.from(container.querySelectorAll("button")).find(
      (b) => b.textContent?.includes("Условия турнира"),
    );
    expect(conditionsBtn).toBeDefined();

    const viewPredictionLink = container.querySelector(
      `a[href="https://docs.google.com/spreadsheets/d/1yEW2fCOmHdTIExshkgFpa749Rlb68C9yEVvjtglxssc/edit?gid=0#gid=0"]`,
    );
    expect(viewPredictionLink).not.toBeNull();
    expect(viewPredictionLink?.textContent).toContain("Посмотреть мой прогноз");

    const playoffForm = createPredictionForm(4, "playoff", {
      predictions: [],
      filledCount: 0,
      requiredCount: 8,
    });
    rerender(<AccountNumberForm form={playoffForm} onReset={noop} />);

    const playoffLink = container.querySelector(
      `a[href="https://docs.google.com/spreadsheets/d/1yEW2fCOmHdTIExshkgFpa749Rlb68C9yEVvjtglxssc/edit?gid=1951409102#gid=1951409102"]`,
    );
    expect(playoffLink).not.toBeNull();
  });
});
