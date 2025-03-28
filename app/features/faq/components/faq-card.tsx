import { Card, CardHeader, CardTitle } from "~/common/components/ui/card";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "~/common/components/ui/avatar";
import { DotIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import { DateTime } from "luxon";

interface FaqCardProps {
  id: number;
  question: string;
  author: string;
  authorAvatarUrl: string | null;
  postedAt: string;
  expanded?: boolean;
}

export function FaqCard({
  id: number,
  question,
  author,
  authorAvatarUrl,
  postedAt,
  expanded = false,
}: FaqCardProps) {
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
          <CardTitle>{question}</CardTitle>
          <div className="flex gap-2 text-sm leading-tight text-muted-foreground">
            <span>{author}</span>
            <DotIcon className="w-4 h-4" />
            <span>{DateTime.fromISO(postedAt).toRelative()}</span>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
