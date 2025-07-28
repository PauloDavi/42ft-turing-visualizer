import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  type Node,
  type Edge,
  applyNodeChanges,
  applyEdgeChanges,
  type OnNodesChange,
  type OnEdgesChange,
  MarkerType,
  Controls,
  MiniMap,
  Background,
  ConnectionLineType,
} from '@xyflow/react';
import { Box, Text, VStack, HStack, Circle, Flex } from '@chakra-ui/react';
import type { TuringMachineDefinition } from '../types/TuringMachine';

import '@xyflow/react/dist/style.css';

// CSS personalizado para self-loops mais circulares
const selfLoopStyle = `
  .react-flow__edge.react-flow__edge-smoothstep {
    z-index: 1000;
  }
  
  .react-flow__edge-smoothstep[data-source][data-target] {
    z-index: 1000 !important;
  }
  
  /* Força self-loops a serem visíveis */
  .react-flow__edge[data-source][data-target] {
    z-index: 1000 !important;
  }
  
  /* Estilo específico para quando source === target */
  .react-flow__edge path[data-source][data-target] {
    stroke-width: 3px !important;
    z-index: 1000 !important;
  }
`;

// Injetar CSS no documento
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = selfLoopStyle;
  if (!document.head.querySelector('style[data-self-loop]')) {
    styleElement.setAttribute('data-self-loop', 'true');
    document.head.appendChild(styleElement);
  }
}

interface MachineGraphProps {
  definition: TuringMachineDefinition | null;
  currentState: string;
  lastTransitionId: string | null;
}

const NODE_RADIUS = 40;

// Generate ReactFlow graph from Turing Machine definition
const generateFlowGraph = (definition: TuringMachineDefinition) => {
  const nodes: Node[] = definition.states.map((state, index) => {
    const angle = (index / definition.states.length) * 2 * Math.PI;
    const radius = 200;
    const centerX = 400;
    const centerY = 300;

    const isInitial = state === definition.initial;
    const isFinal = definition.finals.includes(state);

    return {
      id: state,
      type: 'default', // Usar tipo padrão do ReactFlow
      data: { label: state },
      position: {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      },
      style: {
        width: NODE_RADIUS * 2,
        height: NODE_RADIUS * 2,
        borderRadius: '50%',
        backgroundColor: isFinal ? '#d1fae5' : '#ffffff',
        border: isInitial 
          ? '4px solid #3b82f6' 
          : isFinal 
          ? '3px solid #10b981' 
          : '2px solid #64748b',
        fontSize: '12px',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    };
  });

  const edges: Edge[] = [];
  const linkGroups = new Map<string, Edge[]>();
  const selfLoopCount = new Map<string, number>();

  Object.entries(definition.transitions).forEach(([sourceState, transitions]) => {
    transitions.forEach((transition) => {
      const edgeId = `${sourceState}-${transition.read}-${transition.to_state}-${transition.write}-${transition.action}`;
      const label = `${transition.read}/${transition.write}, ${transition.action}`;
      
      const isSelfLoop = sourceState === transition.to_state;
      
      if (isSelfLoop) {
        const currentCount = selfLoopCount.get(sourceState) || 0;
        selfLoopCount.set(sourceState, currentCount + 1);
        
        edges.push({
          id: edgeId,
          source: sourceState,
          target: transition.to_state,
          label,
          type: 'smoothstep',
          animated: true,
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
          style: {
            stroke: '#64748b',
            strokeWidth: 3, // Aumentar para ser mais visível
            zIndex: 1000,
          },
          labelStyle: {
            fontSize: '11px',
            fontWeight: 'bold',
            fill: '#1f2937',
            zIndex: 1001,
          },
          labelBgStyle: {
            fill: 'white',
            stroke: '#e5e7eb',
            strokeWidth: 1,
            zIndex: 1001,
          },
          // Adicionando dados para identificar self-loops
          data: { isSelfLoop: true },
        });
      } else {
        const groupKey = `${sourceState}-${transition.to_state}`;
        if (!linkGroups.has(groupKey)) {
          linkGroups.set(groupKey, []);
        }
        
        const edge: Edge = {
          id: edgeId,
          source: sourceState,
          target: transition.to_state,
          label,
          type: 'bezier', // Usar bezier para curvas mais arredondadas
          animated: true,
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
          style: {
            stroke: '#64748b',
            strokeWidth: 2,
          },
          labelStyle: {
            fontSize: '10px',
            fontWeight: 'bold',
            fill: '#1f2937',
          },
          labelBgStyle: {
            fill: 'white',
            stroke: '#e5e7eb',
            strokeWidth: 1,
          },
        };
        
        linkGroups.get(groupKey)!.push(edge);
        edges.push(edge);
      }
    });
  });

  return { nodes, edges };
};

export const MachineGraph: React.FC<MachineGraphProps> = ({
  definition,
  currentState,
  lastTransitionId,
}) => {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    if (!definition) return { nodes: [], edges: [] };
    return generateFlowGraph(definition);
  }, [definition]);

  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  // Update nodes and edges when definition changes
  useEffect(() => {
    if (!definition) {
      setNodes([]);
      setEdges([]);
      return;
    }

    const { nodes: newNodes, edges: newEdges } = generateFlowGraph(definition);
    setNodes(newNodes);
    setEdges(newEdges);
  }, [definition]);

  // Update highlights when currentState or lastTransitionId changes
  useEffect(() => {
    if (!definition) return;

    setNodes((nds) =>
      nds.map((node) => {
        const isInitial = node.id === definition.initial;
        const isFinal = definition.finals.includes(node.id);
        const isCurrent = node.id === currentState;

        return {
          ...node,
          style: {
            ...node.style,
            backgroundColor: isCurrent
              ? '#fef3c7'
              : isFinal
              ? '#d1fae5'
              : '#ffffff',
            border: isCurrent
              ? '5px solid #f59e0b'
              : isInitial
              ? '4px solid #3b82f6'
              : isFinal
              ? '3px solid #10b981'
              : '2px solid #64748b',
            boxShadow: isCurrent ? '0 0 15px rgba(245, 158, 11, 0.5)' : 'none',
          },
        };
      })
    );

    setEdges((eds) =>
      eds.map((edge) => {
        const isHighlighted = edge.id === lastTransitionId;
        const isSelfLoop = edge.source === edge.target;
        
        return {
          ...edge,
          style: {
            ...edge.style,
            stroke: isHighlighted ? '#f59e0b' : '#64748b',
            strokeWidth: isSelfLoop ? 
              (isHighlighted ? 5 : 3) : 
              (isHighlighted ? 4 : 2),
            zIndex: isSelfLoop ? 1000 : 1,
          },
          animated: isHighlighted,
        };
      })
    );
  }, [currentState, lastTransitionId, definition]);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  if (!definition) {
    return (
      <VStack gap={6} align="stretch">
        <Box
          bg={{ base: "blue.50", _dark: "blue.900" }}
          p={6}
          borderRadius="xl"
          shadow="inner"
        >
          <Text
            fontSize="2xl"
            fontWeight="bold"
            color={{ base: "blue.800", _dark: "blue.100" }}
            textAlign="center"
          >
            Carregue uma máquina para visualizar o grafo
          </Text>
        </Box>
      </VStack>
    );
  }

  return (
    <VStack gap={6} align="stretch">
      <Box
        bg={{ base: "blue.50", _dark: "blue.900" }}
        p={6}
        borderRadius="xl"
        shadow="inner"
      >
        <Text
          fontSize="2xl"
          fontWeight="bold"
          color={{ base: "blue.800", _dark: "blue.100" }}
          mb={4}
          textAlign="center"
        >
          Visualização ReactFlow - {definition.name}
        </Text>

        <Flex justify="center" mb={4} gap={6} wrap="wrap">
          <HStack gap={2}>
            <Text fontSize="sm" fontWeight="medium">Estado Normal:</Text>
            <Circle
              size="16px"
              bg="white"
              border="2px solid"
              borderColor="gray.500"
            />
          </HStack>
          <HStack gap={2}>
            <Text fontSize="sm" fontWeight="medium">Estado Inicial:</Text>
            <Circle
              size="16px"
              bg="white"
              border="4px solid"
              borderColor="blue.500"
            />
          </HStack>
          <HStack gap={2}>
            <Text fontSize="sm" fontWeight="medium">Estado Final:</Text>
            <Circle
              size="16px"
              bg="green.100"
              border="3px solid"
              borderColor="green.500"
            />
          </HStack>
          <HStack gap={2}>
            <Text fontSize="sm" fontWeight="medium">Estado Atual:</Text>
            <Circle
              size="16px"
              bg="yellow.100"
              border="5px solid"
              borderColor="yellow.500"
            />
          </HStack>
        </Flex>

        <Box
          w="full"
          h="400px"
          border="2px solid"
          borderColor="gray.300"
          borderRadius="md"
          bg="gray.50"
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            attributionPosition="bottom-left"
            connectionLineType={ConnectionLineType.Bezier}
            defaultEdgeOptions={{
              type: 'bezier',
              style: { strokeWidth: 2 },
            }}
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </Box>

        <Text
          fontSize="xs"
          color={{ base: "gray.700", _dark: "gray.100" }}
          textAlign="center"
          mt={2}
        >
          Arraste os estados para reorganizar o diagrama. Use os controles para navegar.
          As transições são mostradas como: entrada/saída, movimento
        </Text>
      </Box>
    </VStack>
  );
};
