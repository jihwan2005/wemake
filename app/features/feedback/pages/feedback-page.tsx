import { Hero } from "~/common/components/hero";
import type { Route } from "./+types/feedback-page";
import { makeSSRClient } from "~/supa-client";
import { getFeedbackPages, getFeedbacks } from "../queries";
import { Suspense, useState } from "react";
import { Await, data, Form, useSearchParams } from "react-router";
import { FeedbackCard } from "../components/feedback-card";
import FeedbackPagination from "~/common/components/feedback-pagination";
import { Input } from "~/common/components/ui/input";
import { z } from "zod";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/common/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import { SORT_OPTIONS } from "../constants";
import { XIcon } from "lucide-react";

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
  const feedbacks = getFeedbacks(client, {
    limit: 7,
    keyword: parsedData.keyword,
    page: Number(url.searchParams.get("page") || 1),
    sorting: parsedData.sorting,
  });
  const totalPages = await getFeedbackPages(client, {
    keyword: parsedData.keyword,
    sorting: parsedData.sorting,
  });
  return { feedbacks, totalPages };
};

const searchParamsSchema = z.object({
  keyword: z.string().optional(),
  sorting: z.enum(["newest", "popular"]).optional().default("newest"),
});

export default function FeedbackPage({ loaderData }: Route.ComponentProps) {
  const { feedbacks } = loaderData;
  const [searchParams, setSearchParams] = useSearchParams();
  const sorting = searchParams.get("sorting") || "newest";
  const [keywords, setKeywords] = useState<string[]>([]);
  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const keyword = formData.get("keyword") as string;

    if (keyword && !keywords.includes(keyword)) {
      setKeywords((prev) => [...prev, keyword]);
    }

    searchParams.set("keyword", keyword);
    setSearchParams(searchParams);
  };
  const removeKeyword = (keyword: string) => {
    setKeywords((prev) => prev.filter((item) => item !== keyword));
  };
  const handleKeywordClick = (keyword: string) => {
    searchParams.set("keyword", keyword);
    setSearchParams(searchParams);
  };
  return (
    <div className="space-y-20">
      <Hero title="Feedback" subtitle="Feedbacks of our users" />
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-1 mb-5">
          <span className="text-sm capitalize">{sorting}</span>
          <ChevronDownIcon className="size-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {SORT_OPTIONS.map((option) => (
            <DropdownMenuCheckboxItem
              className="capitalize cursor-pointer"
              key={option}
              onCheckedChange={(checked: boolean) => {
                if (checked) {
                  searchParams.set("sorting", option);
                  setSearchParams(searchParams);
                }
              }}
            >
              {option}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Form className="w-2/3 mb-5" onSubmit={handleSearch}>
        <Input type="text" name="keyword" placeholder="Search for feedback" />
      </Form>
      {keywords.length > 0 && (
        <div className="text-sm text-gray-500">
          <ul className="flex flex-wrap gap-2">
            {keywords.map((keyword, index) => (
              <li
                key={index}
                className="flex items-center bg-gray-200 text-gray-700 px-3 py-1 rounded-lg"
              >
                <button
                  onClick={() => handleKeywordClick(keyword)}
                  className="mr-2 hover:underline"
                >
                  {keyword}
                </button>
                <button
                  onClick={() => removeKeyword(keyword)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <XIcon className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Suspense fallback={<div>loading...</div>}>
        <Await resolve={feedbacks}>
          {(data) => (
            <div className="space-y-5 grid grid-cols-3 gap-5">
              {data.map((feedback) => (
                <FeedbackCard
                  key={feedback.feedback_id}
                  id={feedback.feedback_id}
                  content={feedback.content}
                  author={feedback.author}
                  authorAvatarUrl={feedback.author_avatar}
                  postedAt={feedback.created_at}
                  votesCount={feedback.upvotes}
                  expanded
                  isUpvoted={feedback.is_upvoted}
                />
              ))}
            </div>
          )}
        </Await>
      </Suspense>
      <FeedbackPagination totalPages={loaderData.totalPages} />
    </div>
  );
}
