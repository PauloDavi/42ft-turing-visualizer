import { Text, Button, HStack, VStack, Link } from "@chakra-ui/react";
import { FaGithub, FaHeart } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export const GitHubInfos = () => {
  const { t } = useTranslation();
  return (
    <VStack gap={3} textAlign="center" mt={4}>
      <Text
        fontSize="lg"
        color={{ base: "gray.600", _dark: "gray.400" }}
        maxW="2xl"
      >
        {t("github.projectDescription")}{" "}
        <Text
          as="span"
          fontWeight="bold"
          color={{ base: "blue.600", _dark: "blue.400" }}
        >
          ft_turing
        </Text>{" "}
        {t("github.description")}
      </Text>

      <HStack gap={4} justify="center" wrap="wrap">
        <Link
          href="https://github.com/PauloDavi/42ft-turing-visualizer"
          target="_blank"
          rel="noopener noreferrer"
          _hover={{ textDecoration: "none" }}
        >
          <Button
            colorScheme="gray"
            variant="outline"
            size="md"
            _hover={{ transform: "translateY(-2px)" }}
            transition="all 0.2s"
            gap={2}
          >
            <FaGithub />
            {t("github.viewOnGithub")}
          </Button>
        </Link>

        <Link
          href="https://github.com/PauloDavi/42ft-turing-visualizer/issues"
          target="_blank"
          rel="noopener noreferrer"
          _hover={{ textDecoration: "none" }}
        >
          <Button
            colorScheme="pink"
            variant="outline"
            size="md"
            _hover={{ transform: "translateY(-2px)" }}
            transition="all 0.2s"
            gap={2}
          >
            <FaHeart />
            {t("github.contribute")}
          </Button>
        </Link>
      </HStack>

      <Text
        fontSize="sm"
        color={{ base: "gray.500", _dark: "gray.500" }}
        textAlign="center"
      >
        {t("github.footer")}
      </Text>
    </VStack>
  );
};
