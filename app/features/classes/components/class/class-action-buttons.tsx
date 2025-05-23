import { List, EyeOff, ThumbsUp, Bell } from "lucide-react";
import { Button } from "~/common/components/ui/button";
import { useFetcher } from "react-router";
import CLassReviewsDialog from "./class-reviews-dialog";
import CLassReviewDialog from "./class-review-dialog";

export interface Review {
  class_post_id: number | null;
  class_review_id: number;
  created_at: string;
  profile_id: string;
  review: string;
  updated_at: string;
  profiles?: {
    username: string;
    avatar: string | null;
  };
}

export interface Lesson {
  title: string | null;
  class_post_id: number | null;
  lesson_id: string | null;
}

interface Props {
  authorId: string;
  userId: string;
  cls: {
    title: string;
    description: string;
    class_post_id: number;
    class_poster: string;
    field: string;
    difficulty_type: "beginner" | "intermediate" | "advanced";
    start_at: string;
    end_at: string;
    hashtags: string[];
  };
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  IsEnrolled: boolean;
  IsUpvoted: boolean;
  IsReviewed: boolean;
  userReview: Review | null;
  classReviews?: Review[];
  myLessons: Lesson[];
}

export default function ClassActionButtons({
  cls,
  isOpen,
  setIsOpen,
  IsEnrolled,
  IsUpvoted,
  IsReviewed,
  userReview,
  classReviews,
}: Props) {
  const fetcher = useFetcher();
  const absordclick = () => {
    fetcher.submit(null, {
      method: "POST",
      action: `/classes/${cls.class_post_id}/upvote`,
    });
  };
  return (
    <div className="flex flex-col gap-4 w-1/7">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          {IsEnrolled ? (
            <div className="flex gap-2">
              <Button variant="outline" onClick={absordclick}>
                <ThumbsUp
                  className={`size-4 ${
                    IsUpvoted ? "text-red-600 fill-current" : ""
                  }`}
                />
              </Button>
              <CLassReviewDialog
                classId={cls.class_post_id}
                IsReviewed={IsReviewed}
                userReview={userReview?.review}
                reviewId={userReview?.class_review_id}
              />
            </div>
          ) : null}
        </div>
        <div className="flex gap-2">
          <CLassReviewsDialog classReviews={classReviews} />
          <Button variant="outline" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <EyeOff className="size-4" />
            ) : (
              <List className="size-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
