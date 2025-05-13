import { useCallback, useRef } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  BackgroundVariant,
  Panel,
  ConnectionMode,
} from "@xyflow/react";
import CustomEdge from "./components/CustomEdge";
import CustomNode from "./components/CustomNode";

import "@xyflow/react/dist/style.css";
import { Button } from "~/common/components/ui/button";

const initialNodes = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
  { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
];
const initialEdges = [
  { id: "e1-2", source: "1", target: "2", type: "custom-edge" },
];

const edgeTypes = {
  "custom-edge": CustomEdge,
};

const nodeTypes = {
  custom: CustomNode, // 아래에 예제 있음
};

export default function ClassMindMapPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const nodeIdRef = useRef(3); // 새 노드 ID를 위한 ref
  const yPositionRef = useRef(10);

  const onConnect = useCallback(
    (connection: any) => {
      const edge = { ...connection, type: "custom-edge" };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges]
  );

  const handleAddNode = () => {
    const newNode = {
      id: nodeIdRef.current.toString(),
      position: { x: 0, y: yPositionRef.current },
      data: { label: nodeIdRef.current.toString() },
    };

    setNodes((nds) => [...nds, newNode]);

    nodeIdRef.current += 1;
    yPositionRef.current += 10; // 아래로 100씩 떨어뜨림
  };
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        edgeTypes={edgeTypes}
        nodeTypes={nodeTypes}
        fitView
        connectionMode={ConnectionMode.Loose}
        connectionRadius={50}
      >
        <Panel position="top-left">
          <Button onClick={handleAddNode}>+ Node</Button>
        </Panel>
        <Controls />
        <Background variant={BackgroundVariant.Lines} />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
