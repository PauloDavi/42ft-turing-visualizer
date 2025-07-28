import { useState } from "react";
import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useTuringMachine } from "./hooks/useTuringMachine";
import {
  StateMachineVisualizer,
  TapeDisplay,
  MachineInfo,
  MachineControls,
  CodeEditor,
  GitHubInfos,
  InputAndControls,
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
    speed,
    loadMachine,
    resetTape,
    stepMachine,
    runMachine,
    pauseMachine,
    increaseSpeed,
    decreaseSpeed,
  } = useTuringMachine();

  const handleLoadMachine = () => {
    loadMachine(tmDefinitionInput, initialTapeInput);
  };

  const handleResetTape = () => {
    resetTape(initialTapeInput);
  };

  // Determine button states
  const canLoad = !isRunning;
  const canReset = !!turingMachine && !isRunning;
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
      <VStack gap={6} align="stretch">
        <VStack gap={4}>
          <Heading as="h1" size="2xl" textAlign="center" fontWeight="extrabold">
            Simulador de Máquina de Turing
            <ColorModeButton ml={2} />
          </Heading>
          <GitHubInfos />
        </VStack>

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
              <InputAndControls
                initialTapeInput={initialTapeInput}
                setInitialTapeInput={setInitialTapeInput}
                handleLoadMachine={handleLoadMachine}
                canLoad={canLoad}
              />
            </GridItem>
          </Grid>

          <Box textAlign="center" mt={4} mb={6}>
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

              <GridItem>
                <MachineControls
                  onStepMachine={stepMachine}
                  onRunMachine={runMachine}
                  onPauseMachine={pauseMachine}
                  onIncreaseSpeed={increaseSpeed}
                  onDecreaseSpeed={decreaseSpeed}
                  handleResetTape={handleResetTape}
                  canReset={canReset}
                  canStep={canStep}
                  canRun={canRun}
                  canPause={canPause}
                  isRunning={isRunning}
                  speed={speed}
                />
              </GridItem>
            </Grid>
          )}
        </Box>
      </VStack>
    </Container>
  );
};

export default App;
