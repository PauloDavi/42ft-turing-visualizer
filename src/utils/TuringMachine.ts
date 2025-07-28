import type {
  TuringMachineDefinition,
  Transition,
} from "../types/TuringMachine";

type TranslationFunction = (
  key: string,
  options?: Record<string, string | number>
) => string;

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
  private t: TranslationFunction;

  constructor(
    definition: TuringMachineDefinition,
    translateFn?: TranslationFunction
  ) {
    this.definition = definition;
    this.tape = [];
    this.headPosition = 0;
    this.currentState = "";
    this.lastAction = translateFn
      ? translateFn("machine.states.notApplicable")
      : "N/A";
    this.lastRead = translateFn
      ? translateFn("machine.states.notApplicable")
      : "N/A";
    this.lastWrite = translateFn
      ? translateFn("machine.states.notApplicable")
      : "N/A";
    this.lastTransitionId = null;
    this.halted = false;
    this.error = false;
    this.message = "";
    this.t = translateFn || ((key: string) => key);
  }

  loadTape(initialTapeString: string): void {
    // Validar se a fita contém apenas caracteres do alfabeto ou símbolo em branco
    const tapeCharacters = initialTapeString.split("");
    for (let i = 0; i < tapeCharacters.length; i++) {
      const char = tapeCharacters[i];
      if (!this.definition.alphabet.includes(char)) {
        this.error = true;
        this.message = this.t("machine.errors.invalidCharacterInTape", {
          char,
          position: i.toString(),
          alphabet: this.definition.alphabet.join(", "),
        });
        return;
      }
    }

    this.tape = tapeCharacters;
    this.headPosition = 0;
    this.currentState = this.definition.initial;
    this.lastAction = this.t("machine.states.initial");
    this.lastRead = this.t("machine.states.notApplicable");
    this.lastWrite = this.t("machine.states.notApplicable");
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
      this.message = this.t("machine.errors.noTransitionForState", {
        state: this.currentState,
      });
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
        this.message = this.t("machine.states.halted", {
          state: this.currentState,
        });
      }
      return true;
    } else {
      this.error = true;
      this.message = this.t("machine.errors.noTransitionForSymbol", {
        state: this.currentState,
        symbol: currentSymbol,
      });
      this.lastTransitionId = null;
      return false;
    }
  }
}
