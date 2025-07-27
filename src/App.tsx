import { useState } from "react";
import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
} from "@chakra-ui/react";
import { useTuringMachine } from "./hooks/useTuringMachine";
import {
  StateMachineVisualizer,
  TapeDisplay,
  MachineInfo,
  MachineControls,
  CodeEditor,
  TapeInput,
} from "./components";
import {
  DEFAULT_MACHINE_DEFINITION,
  DEFAULT_INITIAL_TAPE,
} from "./utils/constants";
import { ColorModeButton } from "./components/ui";

const App = () => {
  const [tmDefinitionInput, setTmDefinitionInput] = useState(
    JSON.stringify(DEFAULT_MACHINE_DEFINITION, null, 2)
  );
  const [initialTapeInput, setInitialTapeInput] =
    useState(DEFAULT_INITIAL_TAPE);

  const {
    turingMachine,
    machineState,
    isRunning,
    loadMachine,
    resetTape,
    stepMachine,
    runMachine,
    pauseMachine,
  } = useTuringMachine();

  const handleLoadMachine = () => {
    loadMachine(tmDefinitionInput, initialTapeInput);
  };

  const handleResetTape = () => {
    resetTape(initialTapeInput);
  };

  // Determine button states
  const canLoad = true;
  const canReset = !!turingMachine;
  const canStep =
    !!turingMachine &&
    !machineState.halted &&
    !machineState.error &&
    !isRunning;
  const canRun =
    !!turingMachine &&
    !machineState.halted &&
    !machineState.error &&
    !isRunning;
  const canPause = isRunning;

  return (
    <Container maxW="container.xl" py={8}>
      <Heading
        as="h1"
        size="2xl"
        textAlign="center"
        mb={6}
        fontWeight="extrabold"
      >
        Simulador de Máquina de Turing
        <ColorModeButton ml={2} />
      </Heading>

      <Box
        bg={{ base: "white", _dark: "gray.800" }}
        shadow="lg"
        borderRadius="xl"
        border="1px solid"
        borderColor={{ base: "gray.200", _dark: "gray.700" }}
        p={8}
      >
        <Grid templateColumns={{ base: "1fr", md: "1fr" }} gap={6} mb={6}>
          <GridItem>
            <CodeEditor
              value={tmDefinitionInput}
              onChange={setTmDefinitionInput}
            />
          </GridItem>
          <GridItem>
            <TapeInput
              value={initialTapeInput}
              onChange={setInitialTapeInput}
            />
          </GridItem>
        </Grid>

        <Box textAlign="center" mt={4}>
          <Text
            fontSize="lg"
            fontWeight="semibold"
            color={machineState.error ? "red.600" : "green.600"}
          >
            {machineState.message}
          </Text>
        </Box>

        {!!turingMachine && (
          <Grid templateColumns={{ base: "1fr", md: "1fr" }} gap={6} mb={6}>
            <GridItem>
              <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
                <GridItem>
                  <TapeDisplay
                    tape={machineState.tape}
                    headPosition={machineState.headPosition}
                  />
                </GridItem>

                <GridItem>
                  <MachineInfo
                    name={turingMachine?.definition.name}
                    currentState={machineState.currentState}
                    headPosition={machineState.headPosition}
                    lastRead={machineState.lastRead}
                    lastWrite={machineState.lastWrite}
                    lastAction={machineState.lastAction}
                  />
                </GridItem>
              </Grid>
            </GridItem>

            <GridItem>
              <StateMachineVisualizer
                definition={turingMachine ? turingMachine.definition : null}
                currentState={machineState.currentState}
                lastTransitionId={machineState.lastTransitionId}
              />
            </GridItem>
          </Grid>
        )}

        <MachineControls
          onLoadMachine={handleLoadMachine}
          onResetTape={handleResetTape}
          onStepMachine={stepMachine}
          onRunMachine={runMachine}
          onPauseMachine={pauseMachine}
          canLoad={canLoad}
          canReset={canReset}
          canStep={canStep}
          canRun={canRun}
          canPause={canPause}
        />
      </Box>
    </Container>
  );
};

export default App;
