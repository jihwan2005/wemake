import { useFetcher } from "react-router";
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
import { DotIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import { DateTime } from "luxon";
import { useState } from "react";

interface VotePostCardProps {
  id: number;
  title: string;
  author: string;
  authorAvatarUrl: string | null;
  postedAt: string;
  expanded?: boolean;
  votesCount?: number[];
  optionContent?: string[];
  content: string;
  isVoted: boolean[];
}

export function VotePostCard({
  id,
  title,
  author,
  authorAvatarUrl,
  postedAt,
  expanded = false,
  votesCount = [],
  content,
  optionContent = [],
  isVoted = [],
}: VotePostCardProps) {
  const fetcher = useFetcher();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const totalVotes = votesCount.reduce((acc, count) => acc + count, 0) || 1;
  const votePercentages = votesCount.map((count) =>
    Math.round((count / totalVotes) * 100)
  );

  const optimisticVoteCounts = optionContent.map((_, index) => {
    const currentVote = votesCount[index] || 0;
    return fetcher.state === "idle"
      ? currentVote
      : selectedOption === index
      ? currentVote + 1
      : currentVote;
  });

  const optimisticIsUpvoted = (index: number) => selectedOption === index;

  const absordclick = (
    e: React.MouseEvent<HTMLButtonElement>,
    optionIndex: number
  ) => {
    e.preventDefault();
    if (selectedOption !== optionIndex) {
      setSelectedOption(optionIndex);
      fetcher.submit(
        { optionIndex: optionIndex.toString() },
        {
          method: "POST",
          action: `/community/${id}/vote`,
        }
      );
    }
  };
  return (
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
          {optionContent.map((option, index) => {
            const isSelected = optimisticIsUpvoted(index);
            return (
              <Button
                key={index}
                variant="outline"
                className={cn(
                  "w-full text-left relative overflow-hidden border",
                  isSelected && isVoted ? "border-primary text-primary" : ""
                )}
                style={{
                  background: `linear-gradient(to right, rgba(59, 130, 246, 0.3) ${votePercentages[index]}%, transparent ${votePercentages[index]}%)`,
                }}
                onClick={(e) => absordclick(e, index)}
              >
                {option} ({optimisticVoteCounts[index]})
              </Button>
            );
          })}
        </div>
      </CardContent>
      {!expanded && (
        <CardFooter className="flex justify-end">
          <Button variant="link">Reply &rarr;</Button>
        </CardFooter>
      )}
    </Card>
  );
}
