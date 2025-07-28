import { useState, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { TuringMachine } from "../utils/TuringMachine";
import {
  validateTuringMachineDefinition,
  validateTapeString,
} from "../utils/validation";
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
  const { t } = useTranslation();
  const [turingMachine, setTuringMachine] = useState<TuringMachine | null>(
    null
  );
  const [machineState, setMachineState] =
    useState<MachineState>(initialMachineState);
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const [speed, setSpeed] = useState(1); // Speed in seconds
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
        const validatedDefinition = validateTuringMachineDefinition(definition, t);

        // Validar fita antes de criar a máquina
        const tapeValidation = validateTapeString(
          initialTapeInput,
          validatedDefinition.alphabet,
          t
        );

        if (!tapeValidation.isValid) {
          throw new Error(tapeValidation.error);
        }

        const newTuringMachine = new TuringMachine(validatedDefinition, t);
        setTuringMachine(newTuringMachine);
        updateMachineState(newTuringMachine);
        setMachineState((prev) => ({
          ...prev,
          message: t("messages.machineLoadedSuccess"),
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
    [updateMachineState, t]
  );

  const resetTape = useCallback(
    (initialTapeInput: string) => {
      if (turingMachine) {
        pauseMachine();
        turingMachine.loadTape(initialTapeInput);
        updateMachineState(turingMachine);
        setMachineState((prev) => ({
          ...prev,
          message: t("messages.tapeReset"),
          error: false,
          halted: false,
        }));
      } else {
        setMachineState((prev) => ({
          ...prev,
          message: t("messages.loadMachineFirst"),
          error: true,
        }));
      }
    },
    [turingMachine, updateMachineState, pauseMachine, t]
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
        message: t("messages.loadAndResetFirst"),
        error: true,
      }));
    }
  }, [turingMachine, updateMachineState, pauseMachine, t]);

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
      }, speed * 1000); // Convert speed to milliseconds

      intervalRef.current = id;
      setIntervalId(id);
    } else {
      setMachineState((prev) => ({
        ...prev,
        message: t("messages.machineNotLoadedOrStopped"),
        error: true,
      }));
    }
  }, [turingMachine, updateMachineState, pauseMachine, speed, t]);

  const increaseSpeed = useCallback(() => {
    setSpeed((prevSpeed) => {
      const newSpeed = Math.max(0.1, prevSpeed - 0.1); // Minimum 0.1 seconds

      // If machine is running, restart with new speed
      if (
        intervalRef.current &&
        turingMachine &&
        !turingMachine.halted &&
        !turingMachine.error
      ) {
        clearInterval(intervalRef.current);
        const id = setInterval(() => {
          const stepped = turingMachine.step();
          updateMachineState(turingMachine);

          if (!stepped || turingMachine.halted || turingMachine.error) {
            pauseMachine();
          }
        }, newSpeed * 1000);

        intervalRef.current = id;
        setIntervalId(id);
      }

      return newSpeed;
    });
  }, [turingMachine, updateMachineState, pauseMachine]);

  const decreaseSpeed = useCallback(() => {
    setSpeed((prevSpeed) => {
      const newSpeed = Math.min(3, prevSpeed + 0.1); // Maximum 3 seconds

      // If machine is running, restart with new speed
      if (
        intervalRef.current &&
        turingMachine &&
        !turingMachine.halted &&
        !turingMachine.error
      ) {
        clearInterval(intervalRef.current);
        const id = setInterval(() => {
          const stepped = turingMachine.step();
          updateMachineState(turingMachine);

          if (!stepped || turingMachine.halted || turingMachine.error) {
            pauseMachine();
          }
        }, newSpeed * 1000);

        intervalRef.current = id;
        setIntervalId(id);
      }

      return newSpeed;
    });
  }, [turingMachine, updateMachineState, pauseMachine]);

  const isRunning = intervalId !== null;

  return {
    turingMachine,
    machineState,
    isRunning,
    speed,
    loadMachine,
    resetTape,
    stepMachine,
    runMachine,
    pauseMachine,
    increaseSpeed,
    decreaseSpeed,
  };
}
