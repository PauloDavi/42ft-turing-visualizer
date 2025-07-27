import { Box, Text, VStack } from "@chakra-ui/react";

interface MachineInfoProps {
  name: string;
  currentState: string;
  headPosition: number;
  lastRead: string;
  lastWrite: string;
  lastAction: string;
}

export const MachineInfo = ({
  name,
  currentState,
  headPosition,
  lastRead,
  lastWrite,
  lastAction,
}: MachineInfoProps) => {
  return (
    <Box bg="purple.50" p={6} borderRadius="xl" shadow="inner">
      <Text
        fontSize="2xl"
        fontWeight="bold"
        color="purple.800"
        mb={4}
        textAlign="center"
      >
        Informações da Máquina - {name}
      </Text>
      <VStack gap={2} color="gray.700" textAlign="center">
        <Text fontSize="lg">
          Estado Atual:{" "}
          <Text as="span" fontWeight="bold" color="purple.700">
            {currentState}
          </Text>
        </Text>
        <Text fontSize="lg">
          Posição da Cabeça:{" "}
          <Text as="span" fontWeight="bold" color="green.700">
            {headPosition}
          </Text>
        </Text>
        <Text fontSize="lg">
          Última Leitura:{" "}
          <Text as="span" fontWeight="bold" color="red.700">
            {lastRead}
          </Text>
        </Text>
        <Text fontSize="lg">
          Última Escrita:{" "}
          <Text as="span" fontWeight="bold" color="red.700">
            {lastWrite}
          </Text>
        </Text>
        <Text fontSize="lg">
          Última Ação:{" "}
          <Text as="span" fontWeight="bold" color="orange.700">
            {lastAction}
          </Text>
        </Text>
      </VStack>
    </Box>
  );
};
