import { Hero } from "~/common/components/hero";
import type { Route } from "./+types/ideas-page";
import { IdeaCard } from "../components/idea-card";
import { getGptIdeas, getGptIdeaPages } from "../queries";
import { Form, data } from "react-router";
import { Input } from "~/common/components/ui/input";
import { z } from "zod";
import IdeaPagination from "~/common/components/idea-pagination";
import { makeSSRClient } from "~/supa-client";
export const meta: Route.MetaFunction = () => {
  return [
    { title: "IdeasGPT | WeMake" },
    { name: "description", content: "Browse and submit ideas for products" },
  ];
};

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
  const ideas = await getGptIdeas(client, {
    limit: 7,
    keyword: parsedData.keyword,
    page: Number(url.searchParams.get("page") || 1),
  });
  const totalPages = await getGptIdeaPages(client, {
    keyword: parsedData.keyword,
  });
  return { ideas, totalPages };
};

export default function IdeasPage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="space-y-20">
      <Hero title="IdeasGPT" subtitle="Find ideas for your project" />
      <Form className="w-2/3">
        <Input type="text" name="keyword" placeholder="Search for ideas" />
      </Form>
      <div className="grid grid-cols-4 gap-4">
        {loaderData.ideas.map((idea) => (
          <IdeaCard
            key={idea.gpt_idea_id}
            id={idea.gpt_idea_id}
            title={idea.idea}
            viewsCount={idea.views}
            postedAt={idea.created_at}
            likesCount={idea.likes}
            claimed={idea.is_claimed}
          />
        ))}
      </div>
      <IdeaPagination totalPages={loaderData.totalPages} />
    </div>
  );
}
