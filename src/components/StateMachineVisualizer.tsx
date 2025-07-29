import { useRef, useCallback, useEffect, useMemo } from "react";
import { Box, Text, HStack, Circle, VStack, Flex } from "@chakra-ui/react";
import * as d3 from "d3";
import { NODE_RADIUS } from "../utils/constants";
import { useTranslation } from "react-i18next";
import { useColorMode } from "./ui";
import type {
  TuringMachineDefinition,
  GraphNode,
  GraphLink,
} from "../types/TuringMachine";

interface StateMachineVisualizerProps {
  definition: TuringMachineDefinition | null;
  currentState: string;
  lastTransitionId: string | null;
}

export const StateMachineVisualizer = ({
  definition,
  currentState,
  lastTransitionId,
}: StateMachineVisualizerProps) => {
  const { t } = useTranslation();
  const { colorMode } = useColorMode();
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(
    null
  );
  const currentDefinitionRef = useRef<TuringMachineDefinition | null>(null);
  const currentColorModeRef = useRef<string>(colorMode);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  // Cores adaptáveis ao tema
  const colors = useMemo(
    () => ({
      // Background e bordas
      svgBackground: colorMode === "dark" ? "#1a202c" : "#f8fafc",
      svgBorder: colorMode === "dark" ? "#4a5568" : "#e2e8f0",

      // Nós (estados)
      nodeFill: colorMode === "dark" ? "#2d3748" : "#ffffff",
      nodeStroke: colorMode === "dark" ? "#a0aec0" : "#64748b",
      nodeText: colorMode === "dark" ? "#f7fafc" : "#1f2937",

      // Estados finais
      finalNodeFill: colorMode === "dark" ? "#2f855a" : "#d1fae5",
      finalNodeStroke: colorMode === "dark" ? "#48bb78" : "#10b981",

      // Estado atual
      currentNodeFill: colorMode === "dark" ? "#c05621" : "#fef3c7",
      currentNodeStroke: colorMode === "dark" ? "#f6ad55" : "#f59e0b",

      // Links (transições)
      linkStroke: colorMode === "dark" ? "#a0aec0" : "#64748b",
      activeLinkStroke: colorMode === "dark" ? "#f6ad55" : "#f59e0b",

      // Texto das transições
      linkTextFill: colorMode === "dark" ? "#f7fafc" : "#1f2937",
      linkTextBg: colorMode === "dark" ? "#2d3748" : "#ffffff",
      linkTextBorder: colorMode === "dark" ? "#4a5568" : "#e5e7eb",
      linkTextStroke: colorMode === "dark" ? "#2d3748" : "#ffffff",
    }),
    [colorMode]
  );

  const updateHighlight = useCallback(() => {
    const svg = d3.select(svgRef.current);
    if (!svg || !definition) return;

    const mainGroup = svg.select(".main-group");
    if (mainGroup.empty()) return;

    // Reset all nodes to default style
    mainGroup
      .selectAll(".node circle")
      .style("fill", colors.nodeFill)
      .style("stroke", colors.nodeStroke)
      .style("stroke-width", "3px");

    // Reset all links to default style
    mainGroup
      .selectAll(".link")
      .style("stroke", colors.linkStroke)
      .style("stroke-width", "2px")
      .style("opacity", "0.7")
      .attr("marker-end", (d) =>
        (d as GraphLink).isSelfLoop ? "url(#self-loop-arrow)" : "url(#arrow)"
      );

    // Style final states with double border
    mainGroup
      .selectAll(".node")
      .filter((d) => definition.finals.includes((d as GraphNode).id))
      .select("circle")
      .style("stroke", colors.finalNodeStroke)
      .style("stroke-width", "4px")
      .style("fill", colors.finalNodeFill);

    // Highlight the current state
    mainGroup
      .selectAll(".node")
      .filter((d) => (d as GraphNode).id === currentState)
      .select("circle")
      .style("fill", colors.currentNodeFill)
      .style("stroke", colors.currentNodeStroke)
      .style("stroke-width", "5px")
      .style("filter", `drop-shadow(0 0 10px ${colors.currentNodeStroke}80)`); // 80 = 50% opacity

    // Highlight the last transition
    if (lastTransitionId) {
      mainGroup
        .selectAll(".link")
        .filter((d) => (d as GraphLink).id === lastTransitionId)
        .style("stroke", colors.activeLinkStroke)
        .style("stroke-width", "4px")
        .style("opacity", "1")
        .attr("marker-end", (d) =>
          (d as GraphLink).isSelfLoop
            ? "url(#active-self-loop-arrow)"
            : "url(#active-arrow)"
        );
    }
  }, [currentState, lastTransitionId, definition, colors]);

  const renderGraph = useCallback(() => {
    if (!definition || !svgRef.current) return;

    // Verificar se o tema mudou
    const themeChanged = currentColorModeRef.current !== colorMode;

    // Recriar o gráfico se a definição mudou OU se o tema mudou
    if (currentDefinitionRef.current === definition && !themeChanged) return;

    // Atualizar as referências
    currentDefinitionRef.current = definition;
    currentColorModeRef.current = colorMode;

    const container = d3.select(svgRef.current.parentNode as Element);
    const width = (container.node() as Element)?.clientWidth || 800;
    const height = 400; // Aumentar altura para acomodar melhor o layout

    // Parar simulação anterior se existir
    if (simulationRef.current) {
      simulationRef.current.stop();
    }

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Criar grupo principal para zoom
    const mainGroup = svg.append("g").attr("class", "main-group");

    // Configurar zoom
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4]) // Zoom de 10% a 400%
      .on("zoom", (event) => {
        mainGroup.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Definir zoom inicial mais reduzido
    const initialScale = 0.6; // 70% do tamanho original
    const initialTransform = d3.zoomIdentity
      .translate(width / 2, height / 2)
      .scale(initialScale)
      .translate(-width / 2, -height / 2);

    svg.call(zoom.transform, initialTransform);
    zoomRef.current = zoom;

    // Create defs for arrow markers
    const defs = svg.append("defs");

    // Normal arrow marker
    defs
      .append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 10) // Posicionar a seta exatamente na borda
      .attr("refY", 0)
      .attr("markerWidth", 8)
      .attr("markerHeight", 8)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .style("fill", colors.linkStroke)
      .style("stroke", colors.linkStroke);

    // Active arrow marker
    defs
      .append("marker")
      .attr("id", "active-arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 10) // Posicionar a seta exatamente na borda
      .attr("refY", 0)
      .attr("markerWidth", 8)
      .attr("markerHeight", 8)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .style("fill", colors.activeLinkStroke)
      .style("stroke", colors.activeLinkStroke);

    // Self-loop arrow marker (melhor posicionamento para loops)
    defs
      .append("marker")
      .attr("id", "self-loop-arrow")
      .attr("viewBox", "-1.2941 -4.8296 10.95 9.659")
      .attr("refX", 9.6593) // Posicionar a seta na borda do estado
      .attr("refY", -2.5882)
      .attr("markerWidth", 8)
      .attr("markerHeight", 8)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M -1.2941 -4.8296 L 9.6593 -2.5882 L 1.2941 4.8296")
      .style("fill", colors.linkStroke)
      .style("stroke", colors.linkStroke);

    // Active self-loop arrow marker
    defs
      .append("marker")
      .attr("id", "active-self-loop-arrow")
      .attr("viewBox", "-1.2941 -4.8296 10.95 9.659")
      .attr("refX", 9.6593) // Posicionar a seta na borda do estado
      .attr("refY", -2.5882)
      .attr("markerWidth", 8)
      .attr("markerHeight", 8)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M -1.2941 -4.8296 L 9.6593 -2.5882 L 1.2941 4.8296")
      .style("fill", colors.activeLinkStroke)
      .style("stroke", colors.activeLinkStroke);

    const graphNodes: GraphNode[] = definition.states.map((state) => ({
      id: state,
    }));
    const graphLinks: GraphLink[] = [];
    const linkGroups = new Map<string, GraphLink[]>();
    const selfLoopCount = new Map<string, number>();

    for (const sourceState in definition.transitions) {
      definition.transitions[sourceState].forEach((t) => {
        const linkId = `${sourceState}-${t.read}-${t.to_state}-${t.write}-${t.action}`;
        const linkData: GraphLink = {
          id: linkId,
          source: sourceState,
          target: t.to_state,
          label: `${t.read}/${t.write}, ${t.action}`,
        };

        if (sourceState === t.to_state) {
          const currentCount = selfLoopCount.get(sourceState) || 0;
          selfLoopCount.set(sourceState, currentCount + 1);
          linkData.isSelfLoop = true;
          linkData.loopIndex = currentCount;
        } else {
          const groupKey = `${sourceState}-${t.to_state}`;
          if (!linkGroups.has(groupKey)) {
            linkGroups.set(groupKey, []);
          }
          linkGroups.get(groupKey)!.push(linkData);
        }
        graphLinks.push(linkData);
      });
    }

    linkGroups.forEach((links) => {
      if (links.length > 1) {
        links.forEach((link, i) => {
          link.multiLinkIndex = i;
          link.totalMultiLinks = links.length;
        });
      }
    });

    const simulation = d3
      .forceSimulation(graphNodes)
      .force(
        "link",
        d3
          .forceLink(graphLinks)
          .id((d) => (d as GraphNode).id)
          .distance(250) // Aumentar distância entre estados conectados
      )
      .force("charge", d3.forceManyBody().strength(-800)) // Aumentar repulsão entre nós
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide(NODE_RADIUS * 3)); // Aumentar área de colisão

    // Armazenar referência da simulação
    simulationRef.current = simulation;

    const link = mainGroup
      .append("g")
      .attr("class", "links")
      .selectAll("path")
      .data(graphLinks)
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("marker-end", (d) =>
        d.isSelfLoop ? "url(#self-loop-arrow)" : "url(#arrow)"
      )
      .style("fill", "none")
      .style("stroke", colors.linkStroke)
      .style("stroke-width", "2px")
      .style("opacity", "0.7");

    // Create link text backgrounds
    const linkTextBackground = mainGroup
      .append("g")
      .attr("class", "link-text-backgrounds")
      .selectAll("rect")
      .data(graphLinks)
      .enter()
      .append("rect")
      .attr("class", "link-text-bg")
      .style("fill", colors.linkTextBg)
      .style("stroke", colors.linkTextBorder)
      .style("stroke-width", "1px")
      .style("rx", "4")
      .style("ry", "4")
      .style("opacity", "0.9");

    const linkText = mainGroup
      .append("g")
      .attr("class", "link-texts")
      .selectAll("text")
      .data(graphLinks)
      .enter()
      .append("text")
      .attr("class", "link-text")
      .text((d) => d.label)
      .style("font-family", "Inter, system-ui, sans-serif")
      .style("font-size", "11px")
      .style("font-weight", "700")
      .style("fill", colors.linkTextFill)
      .style("text-anchor", "middle")
      .style("dominant-baseline", "central")
      .style("pointer-events", "none")
      .style("stroke", colors.linkTextStroke)
      .style("stroke-width", "4px")
      .style("paint-order", "stroke fill");

    const node = mainGroup
      .append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(graphNodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .call(
        d3
          .drag<SVGGElement, GraphNode>()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    node
      .append("circle")
      .attr("r", NODE_RADIUS)
      .style("fill", colors.nodeFill)
      .style("stroke", colors.nodeStroke)
      .style("stroke-width", "3px")
      .style(
        "filter",
        colorMode === "dark"
          ? "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))"
          : "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))"
      )
      .style("cursor", "pointer");

    node
      .append("text")
      .text((d) => d.id)
      .style("font-family", "Inter, system-ui, sans-serif")
      .style("font-size", "14px")
      .style("font-weight", "700")
      .style("fill", colors.nodeText)
      .style("text-anchor", "middle")
      .style("dominant-baseline", "central")
      .style("pointer-events", "none");

    simulation.on("tick", () => {
      link.attr("d", (d) => {
        const source = d.source as GraphNode;
        const target = d.target as GraphNode;

        if (d.isSelfLoop) {
          const loopRadius = NODE_RADIUS * 1.2; // Reduzir tamanho dos loops
          const angleOffset = (d.loopIndex || 0) * (Math.PI / 2);
          const baseAngle = -Math.PI / 2 + angleOffset;

          // Pontos de entrada e saída no círculo do nó (menos espaçados)
          const entryAngle = baseAngle - Math.PI / 8; // 22.5 graus
          const exitAngle = baseAngle + Math.PI / 8; // 22.5 graus

          const entryX = source.x! + NODE_RADIUS * Math.cos(entryAngle);
          const entryY = source.y! + NODE_RADIUS * Math.sin(entryAngle);
          const exitX = source.x! + NODE_RADIUS * Math.cos(exitAngle);
          const exitY = source.y! + NODE_RADIUS * Math.sin(exitAngle);

          // Criar um círculo menor e mais compacto
          return `M ${entryX},${entryY} 
                  A ${loopRadius},${loopRadius} 0 1,1 ${exitX},${exitY}`;
        }

        const dx = target.x! - source.x!;
        const dy = target.y! - source.y!;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Calcular pontos na borda dos círculos
        const startX = source.x! + (NODE_RADIUS * dx) / distance;
        const startY = source.y! + (NODE_RADIUS * dy) / distance;
        const endX = target.x! - (NODE_RADIUS * dx) / distance;
        const endY = target.y! - (NODE_RADIUS * dy) / distance;

        if (d.totalMultiLinks && d.totalMultiLinks > 1) {
          const offset =
            ((d.multiLinkIndex || 0) - (d.totalMultiLinks - 1) / 2) * 20;
          const normal = { x: -dy / distance, y: dx / distance };

          const cpX = (startX + endX) / 2 + offset * normal.x;
          const cpY = (startY + endY) / 2 + offset * normal.y;
          return `M${startX},${startY} Q${cpX},${cpY} ${endX},${endY}`;
        }

        return `M${startX},${startY} L${endX},${endY}`;
      });

      node.attr("transform", (d) => `translate(${d.x},${d.y})`);

      linkText
        .attr("x", (d) => {
          const source = d.source as GraphNode;
          const target = d.target as GraphNode;

          if (d.isSelfLoop) {
            const loopRadius = NODE_RADIUS * 1.2;
            const angleOffset = (d.loopIndex || 0) * (Math.PI / 2);
            const baseAngle = -Math.PI / 2 + angleOffset;
            // Posicionar o texto mais próximo do loop
            return (
              source.x! + (loopRadius + NODE_RADIUS * 0.8) * Math.cos(baseAngle)
            );
          }
          if (d.totalMultiLinks && d.totalMultiLinks > 1) {
            const dx = target.x! - source.x!;
            const dy = target.y! - source.y!;
            const offset =
              ((d.multiLinkIndex || 0) - (d.totalMultiLinks - 1) / 2) * 20;
            const normal = { x: -dy, y: dx };
            const length = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
            normal.x /= length;
            normal.y /= length;
            return (source.x! + target.x!) / 2 + offset * normal.x;
          }
          return (source.x! + target.x!) / 2;
        })
        .attr("y", (d) => {
          const source = d.source as GraphNode;
          const target = d.target as GraphNode;

          if (d.isSelfLoop) {
            const loopRadius = NODE_RADIUS * 1.2;
            const angleOffset = (d.loopIndex || 0) * (Math.PI / 2);
            const baseAngle = -Math.PI / 2 + angleOffset;
            // Posicionar o texto mais próximo do loop
            return (
              source.y! + (loopRadius + NODE_RADIUS * 0.8) * Math.sin(baseAngle)
            );
          }
          if (d.totalMultiLinks && d.totalMultiLinks > 1) {
            const dx = target.x! - source.x!;
            const dy = target.y! - source.y!;
            const offset =
              ((d.multiLinkIndex || 0) - (d.totalMultiLinks - 1) / 2) * 20;
            const normal = { x: -dy, y: dx };
            const length = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
            normal.x /= length;
            normal.y /= length;
            return (source.y! + target.y!) / 2 + offset * normal.y;
          }
          return (source.y! + target.y!) / 2;
        });

      // Position text backgrounds
      linkTextBackground
        .attr("x", (d) => {
          const source = d.source as GraphNode;
          const target = d.target as GraphNode;
          let x: number;

          if (d.isSelfLoop) {
            const loopRadius = NODE_RADIUS * 1.2;
            const angleOffset = (d.loopIndex || 0) * (Math.PI / 2);
            const baseAngle = -Math.PI / 2 + angleOffset;
            x =
              source.x! +
              (loopRadius + NODE_RADIUS * 0.8) * Math.cos(baseAngle);
          } else if (d.totalMultiLinks && d.totalMultiLinks > 1) {
            const dx = target.x! - source.x!;
            const dy = target.y! - source.y!;
            const offset =
              ((d.multiLinkIndex || 0) - (d.totalMultiLinks - 1) / 2) * 20;
            const normal = { x: -dy, y: dx };
            const length = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
            normal.x /= length;
            normal.y /= length;
            x = (source.x! + target.x!) / 2 + offset * normal.x;
          } else {
            x = (source.x! + target.x!) / 2;
          }

          // Center the background rectangle
          const textWidth = d.label.length * 6; // Approximate text width
          return x - textWidth / 2;
        })
        .attr("y", (d) => {
          const source = d.source as GraphNode;
          const target = d.target as GraphNode;
          let y: number;

          if (d.isSelfLoop) {
            const loopRadius = NODE_RADIUS * 1.2;
            const angleOffset = (d.loopIndex || 0) * (Math.PI / 2);
            const baseAngle = -Math.PI / 2 + angleOffset;
            y =
              source.y! +
              (loopRadius + NODE_RADIUS * 0.8) * Math.sin(baseAngle);
          } else if (d.totalMultiLinks && d.totalMultiLinks > 1) {
            const dx = target.x! - source.x!;
            const dy = target.y! - source.y!;
            const offset =
              ((d.multiLinkIndex || 0) - (d.totalMultiLinks - 1) / 2) * 20;
            const normal = { x: -dy, y: dx };
            const length = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
            normal.x /= length;
            normal.y /= length;
            y = (source.y! + target.y!) / 2 + offset * normal.y;
          } else {
            y = (source.y! + target.y!) / 2;
          }

          return y - 8; // Center vertically (half of text height)
        })
        .attr("width", (d) => d.label.length * 6 + 8) // Text width + padding
        .attr("height", 16);
    });

    function dragstarted(
      event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>,
      d: GraphNode
    ) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(
      event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>,
      d: GraphNode
    ) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(
      event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>,
      d: GraphNode
    ) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    updateHighlight();
  }, [definition, updateHighlight, colors, colorMode]);

  useEffect(() => {
    renderGraph();
  }, [definition, renderGraph]); // Incluir renderGraph como dependência

  useEffect(() => {
    updateHighlight();
  }, [updateHighlight]); // Atualizar highlights quando estado/transição mudar

  // Novo useEffect para atualizar cores quando o tema mudar
  useEffect(() => {
    if (definition && svgRef.current && simulationRef.current) {
      renderGraph();
    }
  }, [colorMode, renderGraph, definition]);

  return (
    <VStack gap={6} align="stretch">
      <Box
        bg={{ base: "green.50", _dark: "green.900" }}
        p={6}
        borderRadius="xl"
        shadow="inner"
      >
        <Text
          fontSize="2xl"
          fontWeight="bold"
          color={{ base: "green.800", _dark: "green.100" }}
          mb={4}
          textAlign="center"
        >
          {t("stateMachine.title")}
        </Text>

        <Flex justify="center" mb={4} gap={6} wrap="wrap">
          <HStack gap={2}>
            <Circle
              size="16px"
              bg={{ base: "white", _dark: "gray.700" }}
              border="3px solid"
              borderColor={{ base: "gray.500", _dark: "gray.400" }}
            />
            <Text fontSize="sm" color={{ base: "gray.700", _dark: "gray.100" }}>
              {t("stateMachine.normalState")}
            </Text>
          </HStack>
          <HStack gap={2}>
            <Circle
              size="16px"
              bg={{ base: "yellow.100", _dark: "orange.800" }}
              border="5px solid"
              borderColor={{ base: "yellow.500", _dark: "orange.400" }}
            />
            <Text fontSize="sm" color={{ base: "gray.700", _dark: "gray.100" }}>
              {t("stateMachine.currentState")}
            </Text>
          </HStack>
          <HStack gap={2}>
            <Circle
              size="16px"
              bg={{ base: "green.100", _dark: "green.800" }}
              border="4px solid"
              borderColor={{ base: "green.500", _dark: "green.400" }}
            />
            <Text fontSize="sm" color={{ base: "gray.700", _dark: "gray.100" }}>
              {t("stateMachine.finalState")}
            </Text>
          </HStack>
        </Flex>

        <Box
          as="svg"
          ref={svgRef}
          w="full"
          minH="400px"
          border="1px solid"
          borderColor={{ base: "gray.300", _dark: "gray.600" }}
          borderRadius="md"
          bg={{ base: "gray.50", _dark: "gray.800" }}
        />

        <Text
          fontSize="xs"
          color={{ base: "gray.700", _dark: "gray.100" }}
          textAlign="center"
          mt={2}
        >
          {t("stateMachine.instructions")}
        </Text>
      </Box>
    </VStack>
  );
};
