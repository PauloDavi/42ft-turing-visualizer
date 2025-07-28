import { Button, Flex, Box } from "@chakra-ui/react";
import { FaPlay } from "react-icons/fa";
import { TapeInput } from "./TapeInput";

interface InputAndControlsProps {
  setInitialTapeInput: (value: string) => void;
  handleLoadMachine: () => void;
  initialTapeInput: string;
  canLoad: boolean;
}

export const InputAndControls = ({
  setInitialTapeInput,
  handleLoadMachine,
  initialTapeInput,
  canLoad,
}: InputAndControlsProps) => {
  return (
    <Flex direction="row" gap={4} align="end">
      <Box flex="1">
        <TapeInput value={initialTapeInput} onChange={setInitialTapeInput} />
      </Box>
      <Button
        colorPalette="purple"
        onClick={handleLoadMachine}
        disabled={!canLoad}
        size="lg"
      >
        <FaPlay />
        Carregar Máquina
      </Button>
    </Flex>
  );
};
