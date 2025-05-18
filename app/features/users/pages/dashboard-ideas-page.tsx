import type { Route } from "./+types/dashboard-ideas-page";
import { makeSSRClient } from "~/supa-client";
import { getLoggedInUserId } from "../queries";

export const meta: Route.MetaFunction = () => {
  return [{ title: "My Ideas | wemake" }];
};

export default function DashboardIdeasPage({
  loaderData,
}: Route.ComponentProps) {
  return (
    <div className="space-y-5 h-full">
      <h1 className="text-2xl font-semibold mb-6">Claimed Ideas</h1>
      <div className="grid grid-cols-4 gap-6">hi</div>
    </div>
  );
}
