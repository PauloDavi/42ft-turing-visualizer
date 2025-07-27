import Editor from "@monaco-editor/react";
import { Box, Text } from "@chakra-ui/react";
import { useColorMode } from "./ui";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
}

export const CodeEditor = ({
  value,
  onChange,
  height = "300px",
}: CodeEditorProps) => {
  const handleEditorChange = (value: string | undefined) => {
    onChange(value || "");
  };

  const { colorMode } = useColorMode();

  return (
    <Box>
      <Text fontSize="lg" fontWeight="semibold" mb={2}>
        Definição da Máquina de Turing (JSON):
      </Text>
      <Box
        borderRadius="md"
        overflow="hidden"
        border="1px"
        borderColor="gray.200"
      >
        <Editor
          height={height}
          defaultLanguage="json"
          value={value}
          theme={colorMode == 'dark' ? 'vs-dark' : 'vs-light'}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            scrollbar: { vertical: "auto", horizontal: "auto" },
            wordWrap: "on",
            fontSize: 14,
            automaticLayout: true,
          }}
        />
      </Box>
    </Box>
  );
};
