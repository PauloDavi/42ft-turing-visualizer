/**
 * JSON Schema for Turing Machine validation
 * 
 * IMPLEMENTED VALIDATIONS:
 * 1. ✅ Basic structure: required fields, correct types
 * 2. ✅ Alphabet: unique symbols of 1 character
 * 3. ✅ States: unique non-empty strings
 * 4. ⚠️  Initial state MUST be in the states list (validated via description)
 * 5. ⚠️  Final states MUST be in the states list (validated via description)
 * 6. ⚠️  Blank symbol MUST be in the alphabet (validated via description)
 * 7. ⚠️  Transition keys MUST correspond to states (validated via description)
 * 8. ⚠️  to_state in transitions MUST be valid states (validated via description)
 * 9. ⚠️  read/write MUST be in alphabet or be the blank symbol (validated via description)
 * 
 * NOTE: Validations marked with ⚠️ are documented in descriptions but require
 * additional runtime validation due to JSON Schema limitations for
 * cross-reference validations.
 */
const turingSchema = {
  uri: "http://myserver/my-json-schema.json",
  fileMatch: ["*"],
  schema: {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: "object",
    required: [
      "name",
      "alphabet",
      "blank",
      "states",
      "initial",
      "finals",
      "transitions",
    ],
    additionalProperties: false,
    properties: {
      name: {
        type: "string",
        description: "Turing machine name",
      },
      alphabet: {
        type: "array",
        description: "Alphabet of symbols that the machine can read/write",
        items: {
          type: "string",
          minLength: 1,
          maxLength: 1,
        },
        uniqueItems: true,
        minItems: 1,
      },
      blank: {
        type: "string",
        minLength: 1,
        maxLength: 1,
        description: "Blank symbol of the tape (MUST be in the alphabet)",
      },
      states: {
        type: "array",
        description: "List of machine states",
        items: {
          type: "string",
          minLength: 1,
        },
        uniqueItems: true,
        minItems: 1,
      },
      initial: {
        type: "string",
        minLength: 1,
        description: "Initial state of the machine (MUST be in the states list)",
      },
      finals: {
        type: "array",
        description: "List of final states (ALL must be in the states list)",
        items: {
          type: "string",
          minLength: 1,
        },
        minItems: 1,
      },
      transitions: {
        type: "object",
        description: "Machine transitions organized by state (KEYS must correspond to defined states)",
        patternProperties: {
          "^.+$": {
            type: "array",
            items: {
              type: "object",
              required: ["read", "to_state", "write", "action"],
              additionalProperties: false,
              properties: {
                read: {
                  type: "string",
                  minLength: 1,
                  maxLength: 1,
                  description: "Symbol to be read from the tape (MUST be in alphabet or be the blank symbol)",
                },
                to_state: {
                  type: "string",
                  minLength: 1,
                  description: "Destination state of the transition (MUST be in the states list)",
                },
                write: {
                  type: "string",
                  minLength: 1,
                  maxLength: 1,
                  description: "Symbol to be written to the tape (MUST be in alphabet or be the blank symbol)",
                },
                action: {
                  type: "string",
                  enum: ["LEFT", "RIGHT"],
                  description: "Direction of head movement (LEFT, RIGHT)",
                },
              },
            },
          },
        },
        additionalProperties: false,
      },
    },
  },
};

export default turingSchema;
