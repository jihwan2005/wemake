import { Hero } from "~/common/components/hero";
import type { Route } from "./+types/idea-page";
import { EyeIcon, HeartIcon } from "lucide-react";
import { DotIcon } from "lucide-react";
import { Button } from "~/common/components/ui/button";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Ideas - WeMake" },
    { name: "description", content: "Browse and submit ideas for products" },
  ];
};

export default function IdeaPage() {
  return (
    <div className="">
      <Hero title="Idea #" />
      <div className="max-w-screen-sm mx-auto flex flex-col items-center gap-10">
        <p className="italic text-center">
          "A startup that creates an AI-powered generated personal trainer,
          delivering customized fitness recommendations and tracking of progress
          using a mobile app to track workouts and progress as well as a website
          to manage the business."
        </p>
        <div className="flex items-center text-sm">
          <div className="flex items-center gap-1">
            <EyeIcon className="w-4 h-4" />
            <span>100</span>
          </div>
          <DotIcon className="w-4 h-4" />
          <span>100</span>
          <DotIcon className="w-4 h-4" />
          <Button variant="secondary">
            <HeartIcon className="w-4 h-4" />
            <span>100</span>
          </Button>
        </div>
        <Button size="lg">Claim idea</Button>
      </div>
    </div>
  );
}
