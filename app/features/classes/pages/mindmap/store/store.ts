import {
  applyNodeChanges,
  applyEdgeChanges,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  type OnNodesChange,
  type OnEdgesChange,
  type XYPosition,
} from "@xyflow/react";
import { create } from "zustand";

export type RFState = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  addChildNode: (parentNode: Node, position: XYPosition) => void;
  updateNodeLabel: (nodeId: string, label: string) => void;
  initializeMindmap: (mindmapId: string) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  deleteNodeRecursively: (nodeId: string) => void;
};

const generateLongId = () => {
  return crypto.randomUUID(); // 36자의 고유 ID 생성 (UUIDv4)
};

const useStore = create<RFState>((set, get) => ({
  nodes: [],
  edges: [],

  setNodes: (nodes: Node[]) => set({ nodes }),
  setEdges: (edges: Edge[]) => set({ edges }),

  initializeMindmap: (mindmapId: string) => {
    const rootId = `root-${mindmapId}`;
    set({
      nodes: [
        {
          id: rootId,
          type: "mindmap",
          data: { label: "중심 아이디어" },
          position: { x: 0, y: 0 },
        },
      ],
      edges: [],
    });
  },
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  addChildNode: (parentNode: Node, position: XYPosition) => {
    const newNode = {
      id: generateLongId(),
      type: "mindmap",
      data: { label: "New Node" },
      position,
      parentId: parentNode.id,
    };

    const newEdge = {
      id: generateLongId(),
      source: parentNode.id,
      target: newNode.id,
    };

    set({
      nodes: [...get().nodes, newNode],
      edges: [...get().edges, newEdge],
    });
  },
  updateNodeLabel: (nodeId: string, label: string) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          // Create a completely new node object to ensure React Flow detects the change
          return {
            ...node,
            data: {
              ...node.data,
              label,
            },
          };
        }

        return node;
      }),
    });
  },
  deleteNodeRecursively: (nodeId: string) => {
    const { nodes, edges } = get();

    // 1. 삭제할 노드 ID 전부 수집 (재귀)
    const collectNodeIdsToDelete = (id: string): string[] => {
      const children = nodes.filter((node) => node.parentId === id);
      let ids = [id];
      children.forEach((child) => {
        ids = ids.concat(collectNodeIdsToDelete(child.id));
      });
      return ids;
    };

    const idsToDelete = collectNodeIdsToDelete(nodeId);

    // 2. 노드와 엣지 한 번에 필터링해서 제거
    const updatedNodes = nodes.filter((node) => !idsToDelete.includes(node.id));
    const updatedEdges = edges.filter(
      (edge) =>
        !idsToDelete.includes(edge.source) && !idsToDelete.includes(edge.target)
    );

    // 3. 한 번만 상태 갱신
    set({ nodes: updatedNodes, edges: updatedEdges });
  },
}));

export default useStore;
