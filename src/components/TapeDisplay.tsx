import { useMemo } from "react";
import { Box, Text, HStack, Badge } from "@chakra-ui/react";
import { TAPE_WINDOW_SIZE } from "../utils/constants";

interface TapeDisplayProps {
  tape: string[];
  headPosition: number;
}

export const TapeDisplay = ({ tape, headPosition }: TapeDisplayProps) => {
  const visibleCells = useMemo(() => {
    const start = Math.max(0, headPosition - TAPE_WINDOW_SIZE);
    const end = Math.min(tape.length, headPosition + TAPE_WINDOW_SIZE + 1);

    const cells = [];
    for (let i = start; i < end; i++) {
      cells.push({
        index: i,
        value: tape[i] || ".",
        isHead: i === headPosition,
      });
    }
    return cells;
  }, [tape, headPosition]);

  return (
    <Box
      bg={{ base: "blue.50", _dark: "blue.900" }}
      p={6}
      borderRadius="xl"
      shadow="inner"
      h="full"
    >
      <Text
        fontSize="2xl"
        fontWeight="bold"
        color={{ base: "blue.800", _dark: "blue.100" }}
        mb={4}
        textAlign="center"
      >
        Fita da Máquina de Turing
      </Text>
      <Box
        overflowX="auto"
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH="80px"
        py={4}
      >
        <HStack gap={1} align="center">
          {visibleCells.map((cell) => (
            <Box
              key={cell.index}
              position="relative"
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              {cell.isHead && (
                <Badge
                  colorPalette="green"
                  variant="solid"
                  fontSize="xs"
                  mb={1}
                  px={2}
                >
                  HEAD
                </Badge>
              )}
              <Box
                w="50px"
                h="50px"
                border="2px"
                borderColor={
                  cell.isHead
                    ? "green.500"
                    : { base: "gray.400", _dark: "gray.600" }
                }
                borderRadius="md"
                bg={
                  cell.isHead
                    ? { base: "green.50", _dark: "green.800" }
                    : { base: "white", _dark: "gray.700" }
                }
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="lg"
                fontWeight="bold"
                color={
                  cell.isHead
                    ? { base: "green.700", _dark: "green.200" }
                    : { base: "gray.700", _dark: "gray.200" }
                }
                transition="all 0.3s"
                transform={cell.isHead ? "scale(1.1)" : "scale(1)"}
                boxShadow={cell.isHead ? "lg" : "sm"}
              >
                {cell.value}
              </Box>
              <Text
                fontSize="xs"
                color={{ base: "gray.500", _dark: "gray.400" }}
                mt={1}
              >
                {cell.index}
              </Text>
            </Box>
          ))}
        </HStack>
      </Box>
    </Box>
  );
};
