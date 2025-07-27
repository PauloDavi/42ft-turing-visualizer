import Editor from "@monaco-editor/react";
import { Box, Text } from "@chakra-ui/react";
import { useColorMode } from "./ui";
import { useState, useRef } from "react";

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
  const [editorHeight, setEditorHeight] = useState(parseInt(height) || 300);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);

  const handleEditorChange = (value: string | undefined) => {
    onChange(value || "");
  };

  const { colorMode } = useColorMode();

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    startYRef.current = e.clientY;
    startHeightRef.current = editorHeight;
    
    // Desabilitar seleção de texto durante o redimensionamento
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    
    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      const deltaY = e.clientY - startYRef.current;
      const newHeight = Math.max(150, Math.min(800, startHeightRef.current + deltaY));
      setEditorHeight(newHeight);
    };

    const handleMouseUp = () => {
      // Reabilitar seleção de texto
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <Box>
      <Text fontSize="lg" fontWeight="semibold" mb={2}>
        Definição da Máquina de Turing (JSON):
      </Text>
      <Box
        borderRadius="md"
        overflow="hidden"
        border="1px"
        borderColor={{ base: "gray.200", _dark: "gray.600" }}
        position="relative"
      >
        <Editor
          height={`${editorHeight}px`}
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
        
        {/* Handle de redimensionamento */}
        <Box
          position="absolute"
          bottom="0"
          left="0"
          right="0"
          height="12px"
          bg={{ base: "gray.100", _dark: "gray.700" }}
          cursor="ns-resize"
          onMouseDown={handleMouseDown}
          _hover={{ 
            bg: { base: "gray.200", _dark: "gray.600" } 
          }}
          transition="background-color 0.2s"
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderTop="1px solid"
          borderTopColor={{ base: "gray.300", _dark: "gray.600" }}
          userSelect="none"
        >
          <Box
            width="50px"
            height="4px"
            bg={{ base: "gray.400", _dark: "gray.500" }}
            borderRadius="full"
            position="relative"
          >
            <Box
              position="absolute"
              top="-2px"
              left="50%"
              transform="translateX(-50%)"
              width="60px"
              height="8px"
              borderRadius="full"
              bg={{ base: "gray.300", _dark: "gray.600" }}
              opacity="0.5"
            />
          </Box>
          
          {/* Área invisível maior para facilitar o clique */}
          <Box
            position="absolute"
            top="-10px"
            left="0"
            right="0"
            height="30px"
            cursor="ns-resize"
            onMouseDown={handleMouseDown}
          />
        </Box>
      </Box>
    </Box>
  );
};
