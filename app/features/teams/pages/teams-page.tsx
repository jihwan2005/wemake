import { Hero } from "~/common/components/hero";
import type { Route } from "./+types/teams-page";
import { TeamCard } from "../components/team-card";
import { getTeams } from "../quries";
import { Input } from "~/common/components/ui/input";
import { data, Form } from "react-router";
import TeamPagination from "~/common/components/team-pagination";
import { z } from "zod";
import { getTeamsPages } from "../quries";
import { makeSSRClient } from "~/supa-client";
export const meta: Route.MetaFunction = () => [{ title: "Teams | wemake" }];

const searchParamsSchema = z.object({
  keyword: z.string().optional(),
});

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const { success, data: parsedData } = searchParamsSchema.safeParse(
    Object.fromEntries(url.searchParams)
  );
  if (!success) {
    throw data(
      {
        error_code: "invalid_search_params",
        message: "Invalid search params",
      },
      { status: 400 }
    );
  }
  const { client } = makeSSRClient(request);
  const teams = await getTeams(client, {
    limit: 8,
    page: Number(url.searchParams.get("page") || 1),
    keyword: parsedData.keyword,
  });
  const totalPages = await getTeamsPages(client, {
    keyword: parsedData.keyword,
  });
  return { teams, totalPages };
};

export default function TeamsPage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="space-y-20">
      <Hero title="Teams" subtitle="Find a team looking for a new member." />
      <Form className="w-2/3">
        <Input type="text" name="keyword" placeholder="Search for roles" />
      </Form>
      <div className="grid grid-cols-4 gap-4">
        {loaderData.teams.map((team) => (
          <TeamCard
            key={team.team_id}
            id={team.team_id}
            leaderUsername={team.team_leader.username}
            leaderAvatarUrl={team.team_leader.avatar}
            positions={team.roles.split(",")}
            projectDescription={team.product_description}
          />
        ))}
      </div>
      <TeamPagination totalPages={loaderData.totalPages} />
    </div>
  );
}
