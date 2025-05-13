// ClassMindMapPage.tsx
import { ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import MindMapFlow from "./components/MindMapFlow";

export default function ClassMindMapPage() {
  return (
    <ReactFlowProvider>
      <MindMapFlow />
    </ReactFlowProvider>
  );
}
