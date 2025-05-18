// ClassMindMapPage.tsx
import { ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import MindMapFlow from "./components/MindMapFlow";
import type { Route } from "./+types/class-mindmap-page";
import { makeSSRClient } from "~/supa-client";
import {
  getClassMindmapEdgesById,
  getClassMindmapNodesById,
} from "../../data/queries";
import { saveMindmap } from "../../data/mutations";

export const action = async ({ request, params }: Route.ActionArgs) => {
  const { client } = await makeSSRClient(request);
  const formData = new URLSearchParams(await request.text());
  console.log(formData);
  const nodes = JSON.parse(formData.get("nodes") || "[]");
  const edges = JSON.parse(formData.get("edges") || "[]");
  const thumbnail = formData.get("thumbnail") as string;
  const mindmapId = params.mindmapId;
  if (!mindmapId) {
    throw new Error("mindmap_id is required");
  }
  await saveMindmap(client, mindmapId, nodes, edges, thumbnail);
};

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { client } = await makeSSRClient(request);
  const mindmapId = params.mindmapId;
  const classId = params.classId;
  const nodes = await getClassMindmapNodesById(client, {
    mindmapId,
  });
  const edges = await getClassMindmapEdgesById(client, {
    mindmapId,
  });
  return { mindmapId, classId, nodes, edges };
};

export default function ClassMindMapPage({ loaderData }: Route.ComponentProps) {
  return (
    <ReactFlowProvider>
      <MindMapFlow
        mindmapId={loaderData.mindmapId}
        classId={loaderData.classId}
        nodeData={loaderData.nodes}
        edgeData={loaderData.edges}
      />
    </ReactFlowProvider>
  );
}
