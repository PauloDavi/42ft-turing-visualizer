import { Box, Input, Text } from "@chakra-ui/react";

interface TapeInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const TapeInput = ({
  value,
  onChange,
  placeholder = "Digite os símbolos da fita aqui (ex: 111-11=)",
}: TapeInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <Box>
      <Text fontSize="lg" fontWeight="semibold" mb={2}>
        Fita Inicial:
      </Text>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        size="lg"
        borderColor="gray.300"
        _focus={{
          borderColor: "blue.500",
          boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
        }}
      />
    </Box>
  );
};
