import { Text, Button, HStack, VStack, Link } from "@chakra-ui/react";
import { FaGithub, FaHeart } from "react-icons/fa";

export const GitHubInfos = () => {
  return (
    <VStack gap={3} textAlign="center">
      <Text
        fontSize="lg"
        color={{ base: "gray.600", _dark: "gray.400" }}
        maxW="2xl"
      >
        Projeto desenvolvido para o projeto{" "}
        <Text
          as="span"
          fontWeight="bold"
          color={{ base: "blue.600", _dark: "blue.400" }}
        >
          ft_turing
        </Text>{" "}
        da 42. Visualize e execute Máquinas de Turing de forma interativa!
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
            Ver no GitHub
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
            Contribuir
          </Button>
        </Link>
      </HStack>

      <Text
        fontSize="sm"
        color={{ base: "gray.500", _dark: "gray.500" }}
        textAlign="center"
      >
        ⭐ Curtiu o projeto? Deixe uma estrela no GitHub! Contribuições são
        muito bem-vindas.
      </Text>
    </VStack>
  );
};
