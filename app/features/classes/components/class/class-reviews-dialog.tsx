import { MessagesSquare } from "lucide-react";
import { Button } from "~/common/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "~/common/components/ui/dialog";
import type { Review } from "./class-action-buttons";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/common/components/ui/avatar";
import { DateTime } from "luxon";

export default function ClassReviewsDialog({
  classReviews,
}: {
  classReviews?: Review[];
}) {
  const formatDate = (date: string) => {
    const parsedDate = DateTime.fromISO(date);
    return parsedDate.toRelative();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <MessagesSquare className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="grid grid-cols-2 gap-3">
          {classReviews?.map((review) => (
            <div className="flex items-center gap-3">
              <Avatar className="size-14">
                <AvatarFallback>{review.profiles?.username[0]}</AvatarFallback>
                {review.profiles?.avatar && (
                  <AvatarImage src={review.profiles?.avatar} />
                )}
              </Avatar>
              <div className="flex flex-col">
                <span>{review.profiles?.username}</span>
                <span>{review.review}</span>
                <span className="text-sm text-gray-400">
                  {formatDate(review.created_at)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
