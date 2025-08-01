import type { TuringMachineDefinition } from "../types/TuringMachine";

export const DEFAULT_MACHINE_DEFINITION: TuringMachineDefinition = {
  name: "unary_sub",
  alphabet: ["1", ".", "-", "="],
  blank: ".",
  states: ["scanright", "eraseone", "subone", "skip", "HALT"],
  initial: "scanright",
  finals: ["HALT"],
  transitions: {
    scanright: [
      { read: ".", to_state: "scanright", write: ".", action: "RIGHT" },
      { read: "1", to_state: "scanright", write: "1", action: "RIGHT" },
      { read: "-", to_state: "scanright", write: "-", action: "RIGHT" },
      { read: "=", to_state: "eraseone", write: ".", action: "LEFT" },
    ],
    eraseone: [
      { read: "1", to_state: "subone", write: "=", action: "LEFT" },
      { read: "-", to_state: "HALT", write: ".", action: "LEFT" },
    ],
    subone: [
      { read: "1", to_state: "subone", write: "1", action: "LEFT" },
      { read: "-", to_state: "skip", write: "-", action: "LEFT" },
    ],
    skip: [
      { read: ".", to_state: "skip", write: ".", action: "LEFT" },
      { read: "1", to_state: "scanright", write: ".", action: "RIGHT" },
    ],
  },
};

export const DEFAULT_INITIAL_TAPE = "111-11=";

export const EXECUTION_SPEED_MS = 1000;
export const TAPE_WINDOW_SIZE = 10;
export const NODE_RADIUS = 45;
