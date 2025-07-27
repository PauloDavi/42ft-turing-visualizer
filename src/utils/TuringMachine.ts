import type {
  TuringMachineDefinition,
  Transition,
} from "../types/TuringMachine";

export class TuringMachine {
  definition: TuringMachineDefinition;
  tape: string[];
  headPosition: number;
  currentState: string;
  lastAction: string;
  lastRead: string;
  lastWrite: string;
  lastTransitionId: string | null;
  halted: boolean;
  error: boolean;
  message: string;

  constructor(definition: TuringMachineDefinition) {
    this.definition = definition;
    this.tape = [];
    this.headPosition = 0;
    this.currentState = "";
    this.lastAction = "N/A";
    this.lastRead = "N/A";
    this.lastWrite = "N/A";
    this.lastTransitionId = null;
    this.halted = false;
    this.error = false;
    this.message = "";
  }

  loadTape(initialTapeString: string): void {
    this.tape = initialTapeString.split("");
    this.headPosition = 0;
    this.currentState = this.definition.initial;
    this.lastAction = "Initial";
    this.lastRead = "N/A";
    this.lastWrite = "N/A";
    this.lastTransitionId = null;
    this.halted = false;
    this.error = false;
    this.message = "";

    if (this.tape.length === 0) {
      this.tape.push(this.definition.blank);
    }
  }

  step(): boolean {
    if (this.halted || this.error) {
      return false;
    }

    const currentSymbol = this.tape[this.headPosition] || this.definition.blank;
    this.lastRead = currentSymbol;

    const transitions = this.definition.transitions[this.currentState];
    if (!transitions) {
      this.error = true;
      this.message = `Erro: Nenhuma transição definida para o estado '${this.currentState}'.`;
      this.lastTransitionId = null;
      return false;
    }

    const matchingTransition = transitions.find(
      (t: Transition) => t.read === currentSymbol
    );

    if (matchingTransition) {
      this.tape[this.headPosition] = matchingTransition.write;
      this.lastWrite = matchingTransition.write;
      this.lastAction = matchingTransition.action;

      this.lastTransitionId = `${this.currentState}-${matchingTransition.read}-${matchingTransition.to_state}-${matchingTransition.write}-${matchingTransition.action}`;

      if (matchingTransition.action === "RIGHT") {
        this.headPosition++;
        if (this.headPosition === this.tape.length) {
          this.tape.push(this.definition.blank);
        }
      } else if (matchingTransition.action === "LEFT") {
        this.headPosition--;
        if (this.headPosition < 0) {
          this.tape.unshift(this.definition.blank);
          this.headPosition = 0;
        }
      }

      this.currentState = matchingTransition.to_state;

      if (this.definition.finals.includes(this.currentState)) {
        this.halted = true;
        this.message = `PAROU no estado final '${this.currentState}'.`;
      }
      return true;
    } else {
      this.error = true;
      this.message = `Erro: Nenhuma transição para o estado '${this.currentState}' lendo '${currentSymbol}'.`;
      this.lastTransitionId = null;
      return false;
    }
  }
}
