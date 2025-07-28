import { Button, Wrap, WrapItem } from "@chakra-ui/react";
import {
  FaStepForward,
  FaPlay,
  FaPause,
  FaFastForward,
  FaFastBackward,
  FaRedo,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

interface MachineControlsProps {
  onStepMachine: () => void;
  onRunMachine: () => void;
  onPauseMachine: () => void;
  onIncreaseSpeed: () => void;
  onDecreaseSpeed: () => void;
  handleResetTape: () => void;
  canReset: boolean;
  canStep: boolean;
  canRun: boolean;
  canPause: boolean;
  isRunning: boolean;
  speed: number;
}

export const MachineControls = ({
  onStepMachine,
  onRunMachine,
  onPauseMachine,
  onIncreaseSpeed,
  onDecreaseSpeed,
  handleResetTape,
  canReset,
  canStep,
  canRun,
  canPause,
  isRunning,
  speed,
}: MachineControlsProps) => {
  const { t } = useTranslation();

  return (
    <Wrap justify="center" gap={4} mb={8}>
      <WrapItem>
        <Button
          colorPalette="orange"
          onClick={onDecreaseSpeed}
          disabled={!isRunning}
          size="lg"
          title={t("tooltips.decreaseSpeed")}
        >
          <FaFastBackward />
        </Button>
      </WrapItem>
      <WrapItem>
        <Button
          colorPalette="blue"
          onClick={onRunMachine}
          disabled={!canRun}
          size="lg"
          title={t("tooltips.run")}
        >
          <FaPlay />
          {t("buttons.run")} ({speed.toFixed(2)}s)
        </Button>
      </WrapItem>
      <WrapItem>
        <Button
          colorPalette="orange"
          onClick={onIncreaseSpeed}
          disabled={!isRunning}
          size="lg"
          title={t("tooltips.increaseSpeed")}
        >
          <FaFastForward />
        </Button>
      </WrapItem>
      <WrapItem>
        <Button
          colorPalette="red"
          onClick={onPauseMachine}
          disabled={!canPause}
          size="lg"
          title={t("tooltips.pause")}
        >
          <FaPause />
          {t("buttons.pause")}
        </Button>
      </WrapItem>
      <WrapItem>
        <Button
          colorPalette="green"
          onClick={onStepMachine}
          disabled={!canStep}
          size="lg"
          title={t("tooltips.nextStep")}
        >
          <FaStepForward />
          {t("buttons.nextStep")}
        </Button>
      </WrapItem>
      <WrapItem>
        <Button
          colorPalette="yellow"
          onClick={handleResetTape}
          disabled={!canReset}
          size="lg"
          title={t("tooltips.resetTape")}
        >
          <FaRedo />
          {t("buttons.resetTape")}
        </Button>
      </WrapItem>
    </Wrap>
  );
};
