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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
  CarouselNext,
  CarouselPrevious,
} from "~/common/components/ui/carousel";
import Countdown from "../../utils/countdown-page";
import { Badge } from "~/common/components/ui/badge";
import { cn } from "~/lib/utils";
import {
  Flame,
  Sprout,
  TrendingUp,
  Calendar,
  Layers,
  GraduationCap,
  ThumbsUp,
  User,
  MessageSquare,
  X,
} from "lucide-react";
import { Link, useSearchParams } from "react-router";
import * as motion from "motion/react-client";
import { useEffect, useState } from "react";
import { Button } from "~/common/components/ui/button";

interface ClassCardProps {
  id: number;
  poster: string;
  createdAt: string;
  description: string;
  title: string;
  subtitle: string;
  authorAvatarUrl: string | null;
  authorUsername: string;
  startAt: string;
  endAt: string;
  field: string;
  difficultyType: string;
  hashtags: string[];
  upvotes: number;
  learners: number;
  reviews: number;
  showcaseImages: string[];
  onClose?: () => void;
}

function highlightKeyword(text: string, keyword: string) {
  if (!keyword) return text;

  const parts = text.split(new RegExp(`(${keyword})`, "gi"));
  return parts.map((part, index) =>
    part.toLowerCase() === keyword.toLowerCase() ? (
      <span key={index} className="text-red-500 font-semibold">
        {part}
      </span>
    ) : (
      part
    )
  );
}

export default function ClassCard({
  id,
  poster,
  createdAt,
  description,
  title,
  subtitle,
  authorAvatarUrl,
  authorUsername,
  startAt,
  endAt,
  field,
  difficultyType,
  hashtags,
  upvotes,
  learners,
  reviews,
  onClose,
  showcaseImages,
}: ClassCardProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const start = new Date(startAt);
  const end = new Date(endAt);
  const diffInMs = end.getTime() - start.getTime();
  const diffInWeeks = Math.ceil(diffInMs / (1000 * 60 * 60 * 24 * 7));
  return (
    <div className="w-full">
      <div className="flex justify-center w-full mb-5">
        <span className="text-3xl mt-5">{title}</span>
      </div>
      <div className="flex items-center gap-3 pl-5">
        <div>
          <Badge>
            <ThumbsUp className="size-4" />
            {upvotes}
          </Badge>
          <Badge>
            <User className="size-4" />
            {learners}
          </Badge>
          <Badge>
            <MessageSquare className="size-4" />
            {reviews}
          </Badge>
        </div>
        <div>
          {hashtags.map((hashtag) => (
            <span key={hashtag}>
              <Badge className="bg-gray-400">
                #{highlightKeyword(hashtag, keyword)}
              </Badge>
            </span>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 mt-5 w-full px-5 gap-5">
        <div className="col-span-1">
          <div className="shadow-md w-full rounded-md p-3">
            <div className="flex flex-col">
              <Badge>
                <Layers className="size-4" />
                <span>field</span>
              </Badge>
              <div>
                <span className="text-2xl">{field}</span>
              </div>
            </div>
          </div>
          <div className="shadow-md w-full rounded-md p-3">
            <div className="flex flex-col">
              <Badge>
                <TrendingUp className="size-4" />
                <span>Difficulty</span>
              </Badge>
              <div>
                <span className="text-2xl">{difficultyType}</span>
              </div>
            </div>
          </div>
          <div className="shadow-md w-full rounded-md p-3">
            <div className="flex flex-col">
              <Badge>
                <GraduationCap className="size-4" />
                <span>Teacher</span>
              </Badge>
              <div>
                <span className="text-2xl">{authorUsername}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-1 w-full">
          <Carousel setApi={setApi}>
            <CarouselContent>
              {showcaseImages.map((img, index) => (
                <CarouselItem key={index}>
                  <img
                    src={img}
                    className="w-full h-50 object-cover rounded-md"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="py-2 text-center text-sm text-muted-foreground">
            Slide {current} of {count}
          </div>
        </div>
      </div>
    </div>
  );
}
