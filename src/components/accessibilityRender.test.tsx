// @vitest-environment happy-dom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Cell } from "@/components/Bids/components/Cell";
import { Timer } from "@/components/Timer";
import { TEAM_LIST } from "@/shared/config";
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

  it("таймер объявлен как role=timer без live-анонсов", () => {
    const { container } = render(<Timer />);
    const timer = container.querySelector("[role='timer']");

    expect(timer).not.toBeNull();
    expect(timer?.getAttribute("aria-live")).toBe("off");
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
});
