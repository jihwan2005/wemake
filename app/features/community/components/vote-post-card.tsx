import { Link, useFetcher } from "react-router";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "~/common/components/ui/avatar";
import { Button } from "~/common/components/ui/button";
import { ChevronUpIcon, DotIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import { DateTime } from "luxon";

interface VotePostCardProps {
  id: number;
  title: string;
  author: string;
  authorAvatarUrl: string | null;
  postedAt: string;
  expanded?: boolean;
  votesCount?: number;
  isUpvoted?: boolean;
  optionContent?: string[];
  content: string;
}

export function VotePostCard({
  id,
  title,
  author,
  authorAvatarUrl,
  postedAt,
  expanded = false,
  votesCount = 0,
  isUpvoted = false,
  content,
  optionContent = [],
}: VotePostCardProps) {
  const fetcher = useFetcher();
  const optimisticVoteCount =
    fetcher.state === "idle"
      ? votesCount
      : isUpvoted
      ? votesCount - 1
      : votesCount + 1;
  const optimisticIsUpvoted = fetcher.state === "idle" ? isUpvoted : !isUpvoted;
  const absordclick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    fetcher.submit(null, {
      method: "POST",
      action: `/community/${id}/upvote`,
    });
  };
  const handleVoteOptionClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    option: string
  ) => {
    e.preventDefault();
  };
  return (
    <Link to={`/community/${id}`} className="block">
      <Card
        className={cn(
          "bg-transparent hover:bg-card/50 transition-colors",
          expanded ? "flex flex-row items-center justify-between" : ""
        )}
      >
        <CardHeader className="flex flex-row items-center gap-2">
          <Avatar className="size-14">
            <AvatarFallback>{author[0]}</AvatarFallback>
            {authorAvatarUrl && <AvatarImage src={authorAvatarUrl} />}
          </Avatar>
          <div className="space-y-2">
            <CardTitle>{title}</CardTitle>
            <div className="flex gap-2 text-sm leading-tight text-muted-foreground">
              <span>{author}</span>
              <DotIcon className="w-4 h-4" />
              <span>{DateTime.fromISO(postedAt).toRelative()}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p>{content}</p>
          <div className="mt-2 space-y-2">
            {optionContent.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full text-left"
                onClick={(e) => handleVoteOptionClick(e, option)}
              >
                {index + 1}. {option}
              </Button>
            ))}
          </div>
        </CardContent>
        {!expanded && (
          <CardFooter className="flex justify-end">
            <Button variant="link">Reply &rarr;</Button>
          </CardFooter>
        )}
        {expanded && (
          <CardFooter className="flex justify-end  pb-0">
            <Button
              onClick={absordclick}
              variant="outline"
              className={cn(
                "flex flex-col h-14",
                optimisticIsUpvoted ? "border-primary text-primary" : ""
              )}
            >
              <ChevronUpIcon className="size-4 shrink-0" />
              <span>{optimisticVoteCount}</span>
            </Button>
          </CardFooter>
        )}
      </Card>
    </Link>
  );
}
