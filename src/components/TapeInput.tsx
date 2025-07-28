import { Box, Input, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

interface TapeInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const TapeInput = ({ value, onChange, placeholder }: TapeInputProps) => {
  const { t } = useTranslation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <Box>
      <Text fontSize="lg" fontWeight="semibold" mb={2}>
        {t("labels.tapeInput")}:
      </Text>
      <Input
        placeholder={placeholder || t("placeholders.tapeInput")}
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
