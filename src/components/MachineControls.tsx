import { Button, Wrap, WrapItem } from "@chakra-ui/react";

interface MachineControlsProps {
  onLoadMachine: () => void;
  onResetTape: () => void;
  onStepMachine: () => void;
  onRunMachine: () => void;
  onPauseMachine: () => void;
  canLoad: boolean;
  canReset: boolean;
  canStep: boolean;
  canRun: boolean;
  canPause: boolean;
}

export const MachineControls = ({
  onLoadMachine,
  onResetTape,
  onStepMachine,
  onRunMachine,
  onPauseMachine,
  canLoad,
  canReset,
  canStep,
  canRun,
  canPause,
}: MachineControlsProps) => {
  return (
    <Wrap justify="center" gap={4} mb={8}>
      <WrapItem>
        <Button
          colorPalette="purple"
          onClick={onLoadMachine}
          disabled={!canLoad}
          size="lg"
        >
          Carregar Máquina
        </Button>
      </WrapItem>
      <WrapItem>
        <Button
          colorPalette="gray"
          onClick={onResetTape}
          disabled={!canReset}
          size="lg"
        >
          Reiniciar Fita
        </Button>
      </WrapItem>
      <WrapItem>
        <Button
          colorPalette="green"
          onClick={onStepMachine}
          disabled={!canStep}
          size="lg"
        >
          Próximo Passo
        </Button>
      </WrapItem>
      <WrapItem>
        <Button
          colorPalette="blue"
          onClick={onRunMachine}
          disabled={!canRun}
          size="lg"
        >
          Executar (1s)
        </Button>
      </WrapItem>
      <WrapItem>
        <Button
          colorPalette="red"
          onClick={onPauseMachine}
          disabled={!canPause}
          size="lg"
        >
          Pausar
        </Button>
      </WrapItem>
    </Wrap>
  );
};
