export interface Transition {
  read: string;
  to_state: string;
  write: string;
  action: "LEFT" | "RIGHT";
}

export interface TuringMachineDefinition {
  name: string;
  alphabet: string[];
  blank: string;
  states: string[];
  initial: string;
  finals: string[];
  transitions: Record<string, Transition[]>;
}

export interface MachineState {
  tape: string[];
  headPosition: number;
  currentState: string;
  lastRead: string;
  lastWrite: string;
  lastAction: string;
  lastTransitionId: string | null;
  halted: boolean;
  error: boolean;
  message: string;
}

export interface GraphNode {
  id: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface GraphLink {
  id: string;
  source: string | GraphNode;
  target: string | GraphNode;
  label: string;
  isSelfLoop?: boolean;
  loopIndex?: number;
  multiLinkIndex?: number;
  totalMultiLinks?: number;
}
