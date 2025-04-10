import { Link } from "react-router";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/common/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import Countdown from "./countdown-page";
import { Badge } from "~/common/components/ui/badge";
import { cn } from "~/lib/utils";
import {
  Flame,
  Sprout,
  TrendingUp,
  Calendar,
  Layers,
  GraduationCap,
} from "lucide-react";

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
  const start = new Date(startAt);
  const end = new Date(endAt);
  const diffInMs = end.getTime() - start.getTime();
  const diffInWeeks = Math.ceil(diffInMs / (1000 * 60 * 60 * 24 * 7));
  return (
    <Card className="pt-0">
      <CardHeader className="flex flex-row items-center gap-2 p-0">
        {poster ? (
          <img src={poster} className="w-full h-[250px]" />
        ) : (
          <div className="bg-amber-300 w-full h-[250px] rounded-t-md" />
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-1 text-sm mb-5">
          <CardTitle className="text-2xl">{title}</CardTitle>
        </div>
        <div className="flex gap-1.5 mt-5 mb-5">
          <Badge className="bg-gradient-to-r from-pink-500  to-blue-500 text-white">
            <Layers className="size-4" />
            {field}
          </Badge>
          <Badge
            className={cn("text-white", {
              "bg-green-500": difficultyType === "beginner",
              "bg-yellow-500": difficultyType === "intermediate",
              "bg-red-500": difficultyType === "advanced",
            })}
          >
            {difficultyType === "beginner" && <Sprout className="w-4 h-4" />}
            {difficultyType === "intermediate" && (
              <TrendingUp className="w-4 h-4" />
            )}
            {difficultyType === "advanced" && <Flame className="w-4 h-4" />}
            <span className="capitalize">{difficultyType}</span>
          </Badge>
          <Badge className="bg-blue-600">
            <Calendar className="size-4" />
            {diffInWeeks}weeks
          </Badge>
        </div>
        <div className="flex mb-5 items-center gap-2">
          <Avatar className="size-14">
            <AvatarFallback>{authorUsername[0]}</AvatarFallback>
            {authorAvatarUrl && <AvatarImage src={authorAvatarUrl} />}
          </Avatar>
          <div className="flex flex-col">
            <span>Taught by</span>
            <Badge className="bg-green-700">
              <GraduationCap className="w-5 h-5" />
              <span>{authorUsername}</span>
            </Badge>
          </div>
        </div>
        {description}

        <div className="flex flex-wrap gap-1.5 mt-2">
          {hashtags.map((hashtag) => (
            <span key={hashtag}>
              <Badge className="bg-gray-400">#{hashtag}</Badge>
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
  );
}
