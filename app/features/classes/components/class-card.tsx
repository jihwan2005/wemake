import { DotIcon } from "lucide-react";
import { DateTime } from "luxon";
import { Link } from "react-router";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/common/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";

interface ClassCardProps {
  id: number;
  poster: string;
  createdAt: string;
  description: string;
  title: string;
  authorAvatarUrl: string | null;
  authorUsername: string;
  startAt: string;
  endAt: string;
}

export default function ClassCard({
  id,
  poster,
  createdAt,
  description,
  title,
  authorAvatarUrl,
  authorUsername,
  startAt,
  endAt,
}: ClassCardProps) {
  return (
    <Link to={`/classes/${id}`}>
      <Card className="pt-0">
        <CardHeader className="flex flex-row items-center gap-2 p-0">
          {poster ? (
            poster
          ) : (
            <div className="bg-amber-300 w-[300px] h-[250px]" />
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-1 text-sm mb-5">
            <CardTitle className="text-2xl">{title}</CardTitle>
            <DotIcon className="w-4 h-4" />
            <span>{DateTime.fromISO(createdAt).toRelative()}에 게시됨</span>
          </div>
          <div className="flex mb-5 items-center gap-2">
            <Avatar className="size-14">
              <AvatarFallback>{authorUsername[0]}</AvatarFallback>
              {authorAvatarUrl && <AvatarImage src={authorAvatarUrl} />}
            </Avatar>
            <div className="flex flex-col">
              <span>Taught by</span>
              <span>{authorUsername}</span>
            </div>
          </div>
          {description}
          <div className="mt-5">
            <div className="flex flex-col">
              <span>기간</span>
              <span>
                {DateTime.fromISO(startAt).toFormat("yy년 M월 / d일")} -{" "}
                {DateTime.fromISO(endAt).toFormat("yy년 M월 / d일")}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
