import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { Playoff } from "@/components/Bids/components/Playoff";
import { createInitialState } from "@/components/Bids/components/Playoff/utils/createInitialState";
import { Stage } from "@/components/Bids/components/Stage";
import { Steps } from "@/components/Steps";
import { STAGE_1_TEAM_LIST, TEAM_LIST } from "@/shared/config";
import { setPreviewStep } from "@/shared/tournament/bettingStatus";
import { createEmptyStageSelection } from "@/shared/tournament/stageSelection";

const noop = (): void => undefined;

afterEach(() => {
  cleanup();
  setPreviewStep(null);
});

beforeEach(() => {
  setPreviewStep(1);
});

describe("Stage watermark and stepper layout", () => {
  it("этап 1: водяной знак STAGE 1, степпер желтый", () => {
    setPreviewStep(1);
    const { container } = render(
      <>
        <Steps />
        <Stage
          step={1}
          selection={createEmptyStageSelection()}
          teams={STAGE_1_TEAM_LIST}
          onCellClick={noop}
        />
      </>,
    );

    const watermark = container.querySelector("[class*='watermarkStage1']");
    expect(watermark).not.toBeNull();
    expect(watermark?.textContent).toContain("STAGE 1");
    expect(watermark?.textContent).toContain("S");
    expect(watermark?.textContent).toContain("E");
    expect(watermark?.textContent).toContain("1");

    const activeStep = container.querySelector("[class*='currentStep1']");
    expect(activeStep).not.toBeNull();
    expect(activeStep?.textContent).toBe("1 ЭТАП");
  });

  it("этап 2: водяной знак STAGE 2, степпер оранжевый", () => {
    setPreviewStep(2);
    const { container } = render(
      <>
        <Steps />
        <Stage
          step={2}
          selection={createEmptyStageSelection()}
          teams={STAGE_1_TEAM_LIST}
          onCellClick={noop}
        />
      </>,
    );

    const watermark = container.querySelector("[class*='watermarkStage2']");
    expect(watermark).not.toBeNull();
    expect(watermark?.textContent).toContain("STAGE 2");
    expect(watermark?.textContent).toContain("2");

    const activeStep = container.querySelector("[class*='currentStep2']");
    expect(activeStep).not.toBeNull();
    expect(activeStep?.textContent).toBe("2 ЭТАП");
  });

  it("этап 3: водяной знак STAGE 3, степпер розовый", () => {
    setPreviewStep(3);
    const { container } = render(
      <>
        <Steps />
        <Stage
          step={3}
          selection={createEmptyStageSelection()}
          teams={STAGE_1_TEAM_LIST}
          onCellClick={noop}
        />
      </>,
    );

    const watermark = container.querySelector("[class*='watermarkStage3']");
    expect(watermark).not.toBeNull();
    expect(watermark?.textContent).toContain("STAGE 3");
    expect(watermark?.textContent).toContain("3");

    const activeStep = container.querySelector("[class*='currentStep3']");
    expect(activeStep).not.toBeNull();
    expect(activeStep?.textContent).toBe("3 ЭТАП");
  });

  it("плей-офф (этап 4): водяной знак отсутствует, степпер плей-офф", () => {
    setPreviewStep(4);
    const { container } = render(
      <>
        <Steps />
        <Playoff
          state={createInitialState(TEAM_LIST)}
          teams={TEAM_LIST}
          onScoreChange={noop}
        />
      </>,
    );

    const watermark = container.querySelector("[class*='watermark']");
    expect(watermark).toBeNull();

    const activeStep = container.querySelector("[class*='currentStep4']");
    expect(activeStep).not.toBeNull();
    expect(activeStep?.textContent).toBe("Плей-офф");
  });

  it("клик по шагу степпера вызывает переключение этапа", () => {
    setPreviewStep(1);
    const { container } = render(<Steps />);

    const step3Button = container.querySelector(
      "button[aria-label='Этап: 3 ЭТАП']",
    );
    expect(step3Button).not.toBeNull();

    if (step3Button) {
      fireEvent.click(step3Button);
    }

    const activeStep = container.querySelector("[class*='currentStep3']");
    expect(activeStep).not.toBeNull();
  });
});
