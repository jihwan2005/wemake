import { Hero } from "~/common/components/hero";
import type { Route } from "./+types/feedback-page";
import { makeSSRClient } from "~/supa-client";
import { getFeedbacks } from "../queries";
import { Suspense } from "react";
import { Await } from "react-router";
import { FeedbackCard } from "../components/feedback-card";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const { client } = makeSSRClient(request);
  const feedbacks = getFeedbacks(client);
  return { feedbacks };
};

export default function FeedbackPage({ loaderData }: Route.ComponentProps) {
  const { feedbacks } = loaderData;
  return (
    <div className="space-y-20">
      <Hero title="Feedback" subtitle="Feedbacks of our users" />
      <Suspense fallback={<div>loading...</div>}>
        <Await resolve={feedbacks}>
          {(data) => (
            <div className="space-y-5">
              {data.map((feedback) => (
                <FeedbackCard
                  key={feedback.feedback_id}
                  id={feedback.feedback_id}
                  content={feedback.content}
                  author={feedback.author}
                  authorAvatarUrl={feedback.author_avatar}
                  category={feedback.topic}
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
    </div>
  );
}
