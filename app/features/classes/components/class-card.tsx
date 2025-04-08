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
import Countdown from "./countdown-page";
import { Badge } from "~/common/components/ui/badge";

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
  field: string;
  difficultyType: string;
  hashtags: string[];
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
  field,
  difficultyType,
  hashtags,
}: ClassCardProps) {
  return (
    <Link to={`/classes/${id}`}>
      <Card className="pt-0">
        <CardHeader className="flex flex-row items-center gap-2 p-0">
          {poster ? (
            poster
          ) : (
            <div className="bg-amber-300 w-full h-[250px] rounded-t-md" />
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-1 text-sm mb-5">
            <CardTitle className="text-2xl">{title}</CardTitle>
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
          <div className="flex gap-1.5 mt-5">
            <Badge>{field}</Badge>
            <Badge>{difficultyType}</Badge>
          </div>
          <div className="flex gap-1.5 mt-2">
            {hashtags.map((hashtag) => (
              <span key={hashtag} className="text-sm text-blue-600 font-medium">
                #{hashtag}
              </span>
            ))}
          </div>
          <div className="mt-5">
            <span className="text-sm text-gray-500 mt-1">
              시작까지 <Countdown startAt={startAt} />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
