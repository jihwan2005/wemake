// MindMapFlow.tsx
import {
  ReactFlow,
  Controls,
  Panel,
  type NodeOrigin,
  ConnectionLineType,
  type OnConnectStart,
  type OnConnectEnd,
  useStoreApi,
  useReactFlow,
  type InternalNode,
  Background,
  BackgroundVariant,
  type NodeProps,
  type Node,
} from "@xyflow/react";
import { useRef, useCallback, useEffect } from "react";
import { useShallow } from "zustand/shallow";
import MindMapNode, { type NodeData } from "./CustomNode";
import MindMapEdge from "./CustomEdge";
import type { RFState } from "../store/store";
import useStore from "../store/store";
import { Button } from "~/common/components/ui/button";
import { useNavigate } from "react-router";
import {
  convertDBEdgeToRFEdge,
  convertDBNodeToRFNode,
} from "../utils/convertMinmap";
import html2canvas from "html2canvas";

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  addChildNode: state.addChildNode,
});

const nodeOrigin: NodeOrigin = [0.5, 0.5];
const connectionLineStyle = { stroke: "#F6AD55", strokeWidth: 3 };
const defaultEdgeOptions = { style: connectionLineStyle, type: "mindmap" };

const nodeTypes = {
  mindmap: (nodeProps: NodeProps<Node<NodeData>>) => {
    const deleteNodeRecursively = useStore(
      (state) => state.deleteNodeRecursively
    );
    return (
      <MindMapNode
        {...nodeProps}
        data={{ ...nodeProps.data, onDelete: deleteNodeRecursively }}
      />
    );
  },
};
const edgeTypes = { mindmap: MindMapEdge };

export type MindMapNode = {
  mindmap_id: number;
  node_id: string;
  parent_id: string | null;
  node_label: string | null;
  position_x: number;
  position_y: number;
};

export type MindMapEdge = {
  mindmap_id: number;
  edge_id: string;
  source_node_id: string;
  target_node_id: string;
};

type MindMapFlowProps = {
  mindmapId: string;
  classId: string;
  nodeData: MindMapNode[];
  edgeData: MindMapEdge[];
};

export default function MindMapFlow({
  mindmapId,
  classId,
  nodeData,
  edgeData,
}: MindMapFlowProps) {
  const { nodes, edges, onNodesChange, onEdgesChange, addChildNode } = useStore(
    useShallow(selector)
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (nodeData.length === 0 && edgeData.length === 0) {
      // DB에 데이터가 없으면 기본 루트 노드 세팅
      useStore.getState().initializeMindmap(mindmapId);
    } else {
      // DB 데이터가 있으면 그걸로 세팅
      const rfNodes = nodeData.map(convertDBNodeToRFNode);
      const rfEdges = edgeData.map(convertDBEdgeToRFEdge);
      useStore.getState().setNodes(rfNodes);
      useStore.getState().setEdges(rfEdges);
    }
  }, [mindmapId, nodeData, edgeData]);
  const connectingNodeId = useRef<string | null>(null);
  const store = useStoreApi();
  const { screenToFlowPosition } = useReactFlow();
  const getChildNodePosition = (
    event: MouseEvent | TouchEvent,
    parentNode?: InternalNode
  ) => {
    const { domNode } = store.getState();
    if (
      !domNode ||
      !parentNode?.internals.positionAbsolute ||
      !parentNode?.measured.width ||
      !parentNode?.measured.height
    ) {
      return;
    }

    const isTouchEvent = "touches" in event;
    const x = isTouchEvent ? event.touches[0].clientX : event.clientX;
    const y = isTouchEvent ? event.touches[0].clientY : event.clientY;
    const panePosition = screenToFlowPosition({ x, y });

    return {
      x:
        panePosition.x -
        parentNode.internals.positionAbsolute.x +
        parentNode.measured.width / 2,
      y:
        panePosition.y -
        parentNode.internals.positionAbsolute.y +
        parentNode.measured.height / 2,
    };
  };
  const onConnectStart: OnConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);
  const onConnectEnd: OnConnectEnd = useCallback(
    (event) => {
      const { nodeLookup } = store.getState();
      const targetIsPane = (event.target as Element).classList.contains(
        "react-flow__pane"
      );
      const node = (event.target as Element).closest(".react-flow__node");

      if (node) {
        node.querySelector("input")?.focus({ preventScroll: true });
      } else if (targetIsPane && connectingNodeId.current) {
        const parentNode = nodeLookup.get(connectingNodeId.current);
        const childNodePosition = getChildNodePosition(event, parentNode);

        if (parentNode && childNodePosition) {
          addChildNode(parentNode, childNodePosition);
        }
      }
    },
    [getChildNodePosition]
  );
  const handleSave = async () => {
    // 필요한 정보만 추출하여 저장할 데이터 준비
    const mindmapElement = document.querySelector(
      ".react-flow"
    ) as HTMLElement | null;

    if (!mindmapElement) {
      console.error("마인드맵 요소를 찾을 수 없습니다.");
      return;
    }

    const canvas = await html2canvas(mindmapElement);

    // 3) base64 이미지 데이터 얻기 (png)
    const imageBase64 = canvas.toDataURL("image/png");
    const nodesData = nodes.map((node) => ({
      mindmap_id: mindmapId,
      node_id: node.id,
      parent_id: node.parentId || null, // 부모 노드가 없는 경우 null 처리
      node_label: node.data.label,
      position_x: node.position.x,
      position_y: node.position.y,
    }));

    const edgesData = edges.map((edge) => ({
      mindmap_id: mindmapId,
      edge_id: edge.id,
      source_node_id: edge.source,
      target_node_id: edge.target,
    }));
    const response = await fetch(`/classes/${classId}/mindmaps/${mindmapId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        nodes: JSON.stringify(nodesData),
        edges: JSON.stringify(edgesData),
      }),
    });

    if (response.ok) {
      navigate(`/classes/${classId}/mindmaps/${mindmapId}`);
    } else {
      console.error("저장 실패");
    }
  };
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        nodeOrigin={nodeOrigin}
        connectionLineStyle={connectionLineStyle}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionLineType={ConnectionLineType.Straight}
        fitView
      >
        <Background variant={BackgroundVariant.Lines} />
        <Controls showInteractive={false} />
        <Panel position="top-left">
          <Button onClick={handleSave}>Save</Button>
        </Panel>
      </ReactFlow>
    </div>
  );
}
