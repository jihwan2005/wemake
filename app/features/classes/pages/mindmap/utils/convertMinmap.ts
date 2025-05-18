import type { Node, Edge } from "@xyflow/react";
import type { MindMapNode, MindMapEdge } from "../components/MindMapFlow";

export const convertDBNodeToRFNode = (node: MindMapNode): Node => ({
  id: node.node_id,
  type: "mindmap",
  position: { x: node.position_x, y: node.position_y },
  data: {
    label: node.node_label || "",
    parentId: node.parent_id,
  },
  parentId: node.parent_id ?? undefined,
});

export const convertDBEdgeToRFEdge = (edge: MindMapEdge): Edge => ({
  id: edge.edge_id,
  source: edge.source_node_id,
  target: edge.target_node_id,
  type: "mindmap",
});
