import type { TuringMachineDefinition } from "../types/TuringMachine";

export function validateTapeString(
  tapeString: string,
  alphabet: string[]
): { isValid: boolean; error?: string } {
  for (let i = 0; i < tapeString.length; i++) {
    const char = tapeString[i];
    if (!alphabet.includes(char)) {
      return {
        isValid: false,
        error: `Caractere '${char}' na posição ${i} da fita não está no alfabeto. Alfabeto permitido: [${alphabet.join(
          ", "
        )}].`,
      };
    }
  }

  return { isValid: true };
}

export function validateTuringMachineDefinition(
  definition: unknown
): TuringMachineDefinition {
  // Type guard para verificar se é um objeto
  if (typeof definition !== "object" || definition === null) {
    throw new Error("Definição deve ser um objeto JSON válido.");
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
    throw new Error(
      "Definição inválida da Máquina de Turing. Campos obrigatórios ausentes."
    );
  }

  // Verificação do estado inicial
  if (!Array.isArray(def.states) || !def.states.includes(def.initial)) {
    throw new Error(
      `Estado inicial '${def.initial}' não encontrado na lista de estados.`
    );
  }

  // Verificação do alfabeto
  if (!Array.isArray(def.alphabet)) {
    throw new Error("Alfabeto deve ser um array.");
  }

  for (const symbol of def.alphabet) {
    if (typeof symbol !== "string" || symbol.length !== 1) {
      throw new Error(
        `Símbolo do alfabeto '${symbol}' deve ser uma string de exatamente 1 caractere.`
      );
    }
  }

  // Verificação do símbolo em branco
  if (typeof def.blank !== "string" || def.blank.length !== 1) {
    throw new Error(
      `Símbolo em branco '${def.blank}' deve ser uma string de exatamente 1 caractere.`
    );
  }

  // Verificação dos estados finais
  if (!Array.isArray(def.finals)) {
    throw new Error("Finals deve ser um array.");
  }

  if (def.finals.length === 0) {
    throw new Error("Deve haver pelo menos um estado final.");
  }

  for (const finalState of def.finals) {
    if (!def.states.includes(finalState)) {
      throw new Error(
        `Estado final '${finalState}' não encontrado na lista de estados.`
      );
    }
  }

  // Verificação das transições
  const transitions = def.transitions as Record<string, unknown>;
  for (const state in transitions) {
    if (!def.states.includes(state)) {
      throw new Error(
        `Estado '${state}' nas transições não está na lista de estados definidos.`
      );
    }

    const stateTransitions = transitions[state];
    if (!Array.isArray(stateTransitions)) {
      throw new Error(
        `Transições para o estado '${state}' devem ser um array.`
      );
    }

    for (const transition of stateTransitions) {
      if (typeof transition !== "object" || transition === null) {
        throw new Error(`Transição inválida no estado '${state}'.`);
      }

      const t = transition as Record<string, unknown>;

      // Verificação do símbolo de leitura
      if (typeof t.read !== "string" || t.read.length !== 1) {
        throw new Error(
          `Símbolo de leitura '${t.read}' na transição do estado '${state}' deve ser uma string de exatamente 1 caractere.`
        );
      }

      if (
        !Array.isArray(def.alphabet) ||
        (!def.alphabet.includes(t.read) && t.read !== def.blank)
      ) {
        throw new Error(
          `Transição no estado '${state}' lê '${t.read}' que não está no alfabeto ou é o símbolo em branco.`
        );
      }

      // Verificação do símbolo de escrita
      if (typeof t.write !== "string" || t.write.length !== 1) {
        throw new Error(
          `Símbolo de escrita '${t.write}' na transição do estado '${state}' deve ser uma string de exatamente 1 caractere.`
        );
      }
      if (
        !Array.isArray(def.alphabet) ||
        (!def.alphabet.includes(t.write) && t.write !== def.blank)
      ) {
        throw new Error(
          `Transição no estado '${state}' escreve '${t.write}' que não está no alfabeto ou é o símbolo em branco.`
        );
      }

      // Verificação da ação
      if (!["LEFT", "RIGHT"].includes(t.action as string)) {
        throw new Error(
          `Transição no estado '${state}' tem ação inválida '${t.action}'. Deve ser 'LEFT' ou 'RIGHT'.`
        );
      }

      // Verificação do estado de destino
      if (!def.states.includes(t.to_state)) {
        throw new Error(
          `Transição no estado '${state}' vai para um estado desconhecido '${t.to_state}'.`
        );
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
    throw new Error(
      `Os seguintes estados não finais não possuem transições definidas: ${missingStates.join(
        ", "
      )}.`
    );
  }
  if (extraStates.length > 0) {
    throw new Error(
      `As transições possuem estados que não são estados não finais: ${extraStates.join(
        ", "
      )}.`
    );
  }

  return def as unknown as TuringMachineDefinition;
}
