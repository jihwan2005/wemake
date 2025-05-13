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
} from "@xyflow/react";
import { useRef, useCallback } from "react";
import { useShallow } from "zustand/shallow";
import MindMapNode from "./CustomNode";
import MindMapEdge from "./CustomEdge";
import type { RFState } from "../store/store";
import useStore from "../store/store";

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

const nodeTypes = { mindmap: MindMapNode };
const edgeTypes = { mindmap: MindMapEdge };

export default function MindMapFlow() {
  const { nodes, edges, onNodesChange, onEdgesChange, addChildNode } = useStore(
    useShallow(selector)
  );
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
        <Controls showInteractive={false} />
        <Panel position="top-left">React Flow Mind Map</Panel>
      </ReactFlow>
    </div>
  );
}
