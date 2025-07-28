import { Button, Wrap, WrapItem } from "@chakra-ui/react";
import {
  FaStepForward,
  FaPlay,
  FaPause,
  FaFastForward,
  FaFastBackward,
  FaRedo,
} from "react-icons/fa";

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
  return (
    <Wrap justify="center" gap={4} mb={8}>
      <WrapItem>
        <Button
          colorPalette="orange"
          onClick={onDecreaseSpeed}
          disabled={!isRunning}
          size="lg"
          title="Diminui a velocidade de execução da máquina (mais lento)"
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
          title="Executa a máquina automaticamente com a velocidade atual"
        >
          <FaPlay />
          Executar ({speed.toFixed(2)}s)
        </Button>
      </WrapItem>
      <WrapItem>
        <Button
          colorPalette="orange"
          onClick={onIncreaseSpeed}
          disabled={!isRunning}
          size="lg"
          title="Aumenta a velocidade de execução da máquina (mais rápido)"
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
          title="Para a execução automática da máquina"
        >
          <FaPause />
          Pausar
        </Button>
      </WrapItem>
      <WrapItem>
        <Button
          colorPalette="green"
          onClick={onStepMachine}
          disabled={!canStep}
          size="lg"
          title="Executa apenas um passo da máquina de Turing"
        >
          <FaStepForward />
          Próximo Passo
        </Button>
      </WrapItem>
      <WrapItem>
        <Button
          colorPalette="yellow"
          onClick={handleResetTape}
          disabled={!canReset}
          size="lg"
          title="Reinicia a fita com o input inicial e reseta o estado da máquina"
        >
          <FaRedo />
          Reiniciar Fita
        </Button>
      </WrapItem>
    </Wrap>
  );
};
