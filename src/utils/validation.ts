import type { TuringMachineDefinition } from "../types/TuringMachine";

type TranslationFunction = (
  key: string,
  options?: Record<string, string | number>
) => string;

export function validateTapeString(
  tapeString: string,
  alphabet: string[],
  t?: TranslationFunction
): { isValid: boolean; error?: string } {
  for (let i = 0; i < tapeString.length; i++) {
    const char = tapeString[i];
    if (!alphabet.includes(char)) {
      const errorMessage = t
        ? t("validation.tape.invalidCharacter", {
            char,
            position: i.toString(),
            alphabet: alphabet.join(", "),
          })
        : `Caractere '${char}' na posição ${i} da fita não está no alfabeto. Alfabeto permitido: [${alphabet.join(
            ", "
          )}].`;

      return {
        isValid: false,
        error: errorMessage,
      };
    }
  }

  return { isValid: true };
}

export function validateTuringMachineDefinition(
  definition: unknown,
  t?: TranslationFunction
): TuringMachineDefinition {
  // Type guard para verificar se é um objeto
  if (typeof definition !== "object" || definition === null) {
    const message = t
      ? t("validation.definition.mustBeObject")
      : "Definição deve ser um objeto JSON válido.";
    throw new Error(message);
  }

  const def = definition as Record<string, unknown>;

  // Verificação de campos obrigatórios
  if (
    !def.name ||
    !def.alphabet ||
    !def.blank ||
    !def.states ||
    !def.initial ||
    !def.finals ||
    !def.transitions
  ) {
    const message = t
      ? t("validation.definition.missingFields")
      : "Definição inválida da Máquina de Turing. Campos obrigatórios ausentes.";
    throw new Error(message);
  }

  // Verificação do estado inicial
  if (!Array.isArray(def.states) || !def.states.includes(def.initial)) {
    const message = t
      ? t("validation.definition.initialStateNotFound", {
          state: def.initial as string,
        })
      : `Estado inicial '${def.initial}' não encontrado na lista de estados.`;
    throw new Error(message);
  }

  // Verificação do alfabeto
  if (!Array.isArray(def.alphabet)) {
    const message = t
      ? t("validation.definition.alphabetMustBeArray")
      : "Alfabeto deve ser um array.";
    throw new Error(message);
  }

  for (const symbol of def.alphabet) {
    if (typeof symbol !== "string" || symbol.length !== 1) {
      const message = t
        ? t("validation.definition.invalidAlphabetSymbol", {
            symbol: symbol as string,
          })
        : `Símbolo do alfabeto '${symbol}' deve ser uma string de exatamente 1 caractere.`;
      throw new Error(message);
    }
  }

  // Verificação do símbolo em branco
  if (typeof def.blank !== "string" || def.blank.length !== 1) {
    const message = t
      ? t("validation.definition.invalidBlankSymbol", {
          blank: def.blank as string,
        })
      : `Símbolo em branco '${def.blank}' deve ser uma string de exatamente 1 caractere.`;
    throw new Error(message);
  }

  // Verificação dos estados finais
  if (!Array.isArray(def.finals)) {
    const message = t
      ? t("validation.definition.finalsMustBeArray")
      : "Finals deve ser um array.";
    throw new Error(message);
  }

  if (def.finals.length === 0) {
    const message = t
      ? t("validation.definition.noFinalStates")
      : "Deve haver pelo menos um estado final.";
    throw new Error(message);
  }

  for (const finalState of def.finals) {
    if (!def.states.includes(finalState)) {
      const message = t
        ? t("validation.definition.finalStateNotFound", {
            state: finalState as string,
          })
        : `Estado final '${finalState}' não encontrado na lista de estados.`;
      throw new Error(message);
    }
  }

  // Verificação das transições
  const transitions = def.transitions as Record<string, unknown>;
  for (const state in transitions) {
    if (!def.states.includes(state)) {
      const message = t
        ? t("validation.definition.transitionStateNotInList", { state })
        : `Estado '${state}' nas transições não está na lista de estados definidos.`;
      throw new Error(message);
    }

    const stateTransitions = transitions[state];
    if (!Array.isArray(stateTransitions)) {
      const message = t
        ? t("validation.definition.transitionsMustBeArray", { state })
        : `Transições para o estado '${state}' devem ser um array.`;
      throw new Error(message);
    }

    for (const transition of stateTransitions) {
      if (typeof transition !== "object" || transition === null) {
        const message = t
          ? t("validation.definition.invalidTransition", { state })
          : `Transição inválida no estado '${state}'.`;
        throw new Error(message);
      }

      const trans = transition as Record<string, unknown>;

      // Verificação do símbolo de leitura
      if (typeof trans.read !== "string" || trans.read.length !== 1) {
        const message = t
          ? t("validation.definition.invalidReadSymbol", {
              state,
              symbol: trans.read as string,
            })
          : `Símbolo de leitura '${trans.read}' na transição do estado '${state}' deve ser uma string de exatamente 1 caractere.`;
        throw new Error(message);
      }

      if (
        !Array.isArray(def.alphabet) ||
        (!def.alphabet.includes(trans.read) && trans.read !== def.blank)
      ) {
        const message = t
          ? t("validation.definition.readSymbolNotInAlphabet", {
              state,
              symbol: trans.read,
            })
          : `Transição no estado '${state}' lê '${trans.read}' que não está no alfabeto ou é o símbolo em branco.`;
        throw new Error(message);
      }

      // Verificação do símbolo de escrita
      if (typeof trans.write !== "string" || trans.write.length !== 1) {
        const message = t
          ? t("validation.definition.invalidWriteSymbol", {
              state,
              symbol: trans.write as string,
            })
          : `Símbolo de escrita '${trans.write}' na transição do estado '${state}' deve ser uma string de exatamente 1 caractere.`;
        throw new Error(message);
      }
      if (
        !Array.isArray(def.alphabet) ||
        (!def.alphabet.includes(trans.write) && trans.write !== def.blank)
      ) {
        const message = t
          ? t("validation.definition.writeSymbolNotInAlphabet", {
              state,
              symbol: trans.write,
            })
          : `Transição no estado '${state}' escreve '${trans.write}' que não está no alfabeto ou é o símbolo em branco.`;
        throw new Error(message);
      }

      // Verificação da ação
      if (!["LEFT", "RIGHT"].includes(trans.action as string)) {
        const message = t
          ? t("validation.definition.invalidAction", {
              state,
              action: trans.action as string,
            })
          : `Transição no estado '${state}' tem ação inválida '${trans.action}'. Deve ser 'LEFT' ou 'RIGHT'.`;
        throw new Error(message);
      }

      // Verificação do estado de destino
      if (!def.states.includes(trans.to_state)) {
        const message = t
          ? t("validation.definition.unknownToState", {
              state,
              toState: trans.to_state as string,
            })
          : `Transição no estado '${state}' vai para um estado desconhecido '${trans.to_state}'.`;
        throw new Error(message);
      }
    }
  }

  // Verificação de consistência: todos os estados referenciados nas transições devem estar na lista de estados
  const finals = def.finals as string[];
  const nonFinalStates = (def.states as string[]).filter(
    (state: string) => !finals.includes(state)
  );
  const transitionStates = Object.keys(def.transitions);

  const missingStates = nonFinalStates.filter(
    (state: string) => !transitionStates.includes(state)
  );
  const extraStates = transitionStates.filter(
    (state: string) => !nonFinalStates.includes(state)
  );

  if (missingStates.length > 0) {
    const message = t
      ? t("validation.definition.missingTransitions", {
          states: missingStates.join(", "),
        })
      : `Os seguintes estados não finais não possuem transições definidas: ${missingStates.join(
          ", "
        )}.`;
    throw new Error(message);
  }
  if (extraStates.length > 0) {
    const message = t
      ? t("validation.definition.extraTransitions", {
          states: extraStates.join(", "),
        })
      : `As transições possuem estados que não são estados não finais: ${extraStates.join(
          ", "
        )}.`;
    throw new Error(message);
  }

  return def as unknown as TuringMachineDefinition;
}
