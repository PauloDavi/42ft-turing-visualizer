import { useState, useCallback, useRef } from "react";
import { TuringMachine } from "../utils/TuringMachine";
import { validateTuringMachineDefinition } from "../utils/validation";
import { EXECUTION_SPEED_MS } from "../utils/constants";
import type { MachineState } from "../types/TuringMachine";

const initialMachineState: MachineState = {
  tape: [],
  headPosition: 0,
  currentState: "N/A",
  lastRead: "N/A",
  lastWrite: "N/A",
  lastAction: "N/A",
  lastTransitionId: null,
  halted: false,
  error: false,
  message: "",
};

export function useTuringMachine() {
  const [turingMachine, setTuringMachine] = useState<TuringMachine | null>(
    null
  );
  const [machineState, setMachineState] =
    useState<MachineState>(initialMachineState);
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  const updateMachineState = useCallback((tmInstance: TuringMachine) => {
    setMachineState({
      tape: [...tmInstance.tape],
      headPosition: tmInstance.headPosition,
      currentState: tmInstance.currentState,
      lastRead: tmInstance.lastRead,
      lastWrite: tmInstance.lastWrite,
      lastAction: tmInstance.lastAction,
      lastTransitionId: tmInstance.lastTransitionId,
      halted: tmInstance.halted,
      error: tmInstance.error,
      message: tmInstance.message,
    });
  }, []);

  const pauseMachine = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIntervalId(null);
    }
  }, []);

  const loadMachine = useCallback(
    (definitionJson: string, initialTapeInput: string) => {
      try {
        const definition = JSON.parse(definitionJson);
        const validatedDefinition = validateTuringMachineDefinition(definition);

        const newTuringMachine = new TuringMachine(validatedDefinition);
        setTuringMachine(newTuringMachine);
        updateMachineState(newTuringMachine);
        setMachineState((prev) => ({
          ...prev,
          message: "Máquina de Turing carregada com sucesso!",
          error: false,
        }));
        newTuringMachine.loadTape(initialTapeInput);
        updateMachineState(newTuringMachine);

        return newTuringMachine;
      } catch (e) {
        setTuringMachine(null);
        setMachineState({
          ...initialMachineState,
          message: `Erro ao carregar a máquina: ${(e as Error).message}`,
          error: true,
        });
        return null;
      }
    },
    [updateMachineState]
  );

  const resetTape = useCallback(
    (initialTapeInput: string) => {
      if (turingMachine) {
        pauseMachine();
        turingMachine.loadTape(initialTapeInput);
        updateMachineState(turingMachine);
        setMachineState((prev) => ({
          ...prev,
          message: "Fita reiniciada.",
          error: false,
          halted: false,
        }));
      } else {
        setMachineState((prev) => ({
          ...prev,
          message: "Por favor, carregue uma Máquina de Turing primeiro.",
          error: true,
        }));
      }
    },
    [turingMachine, updateMachineState, pauseMachine]
  );

  const stepMachine = useCallback(() => {
    if (turingMachine && !turingMachine.halted && !turingMachine.error) {
      pauseMachine();
      turingMachine.step();
      updateMachineState(turingMachine);
    } else if (turingMachine && (turingMachine.halted || turingMachine.error)) {
      // Machine is already halted or in error, message is already visible
    } else {
      setMachineState((prev) => ({
        ...prev,
        message:
          "Por favor, carregue e reinicie uma Máquina de Turing primeiro.",
        error: true,
      }));
    }
  }, [turingMachine, updateMachineState, pauseMachine]);

  const runMachine = useCallback(() => {
    if (turingMachine && !turingMachine.halted && !turingMachine.error) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      const id = setInterval(() => {
        const stepped = turingMachine.step();
        updateMachineState(turingMachine);

        if (!stepped || turingMachine.halted || turingMachine.error) {
          pauseMachine();
        }
      }, EXECUTION_SPEED_MS);

      intervalRef.current = id;
      setIntervalId(id);
    } else {
      setMachineState((prev) => ({
        ...prev,
        message: "Máquina não carregada ou já parou/erro. Reinicie a fita.",
        error: true,
      }));
    }
  }, [turingMachine, updateMachineState, pauseMachine]);

  const isRunning = intervalId !== null;

  return {
    turingMachine,
    machineState,
    isRunning,
    loadMachine,
    resetTape,
    stepMachine,
    runMachine,
    pauseMachine,
  };
}
