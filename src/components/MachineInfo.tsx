import { Box, Text, VStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  return (
    <Box
      bg={{ base: "purple.50", _dark: "purple.900" }}
      p={6}
      borderRadius="xl"
      shadow="inner"
    >
      <Text
        fontSize="2xl"
        fontWeight="bold"
        color={{ base: "purple.800", _dark: "purple.100" }}
        mb={4}
        textAlign="center"
      >
        {t("machineInfo.title", { name })}
      </Text>
      <VStack
        gap={2}
        color={{ base: "gray.700", _dark: "gray.200" }}
        textAlign="center"
      >
        <Text fontSize="lg">
          {t("labels.currentState")}:{" "}
          <Text
            as="span"
            fontWeight="bold"
            color={{ base: "purple.700", _dark: "purple.300" }}
          >
            {currentState}
          </Text>
        </Text>
        <Text fontSize="lg">
          {t("labels.headPosition")}:{" "}
          <Text
            as="span"
            fontWeight="bold"
            color={{ base: "green.700", _dark: "green.300" }}
          >
            {headPosition}
          </Text>
        </Text>
        <Text fontSize="lg">
          {t("labels.lastRead")}:{" "}
          <Text
            as="span"
            fontWeight="bold"
            color={{ base: "red.700", _dark: "red.300" }}
          >
            {lastRead}
          </Text>
        </Text>
        <Text fontSize="lg">
          {t("labels.lastWrite")}:{" "}
          <Text
            as="span"
            fontWeight="bold"
            color={{ base: "red.700", _dark: "red.300" }}
          >
            {lastWrite}
          </Text>
        </Text>
        <Text fontSize="lg">
          {t("labels.lastAction")}:{" "}
          <Text
            as="span"
            fontWeight="bold"
            color={{ base: "orange.700", _dark: "orange.300" }}
          >
            {lastAction}
          </Text>
        </Text>
      </VStack>
    </Box>
  );
};
