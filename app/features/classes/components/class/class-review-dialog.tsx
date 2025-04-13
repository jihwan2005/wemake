import { LoaderCircle, MessageSquareText } from "lucide-react";
import { useEffect, useState } from "react";
import { useFetcher, useNavigation } from "react-router";
import { Button } from "~/common/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "~/common/components/ui/dialog";
import { Input } from "~/common/components/ui/input";
import { Textarea } from "~/common/components/ui/textarea";

export default function CLassReviewDialog({
  classId,
  IsReviewed,
  userReview,
  reviewId,
}: {
  classId: number;
  IsReviewed: boolean;
  userReview?: string;
  reviewId?: number;
}) {
  const navigation = useNavigation();
  const isSubmitting =
    navigation.state === "submitting" || navigation.state === "loading";
  const [isReviewClassDialogOpen, setIsReviewClassDialogOpen] = useState(false);
  const fetcher = useFetcher();
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      setIsReviewClassDialogOpen(false);
    }
  }, [fetcher.state, fetcher.data]);
  const handleDelete = () => {
    fetcher.submit(
      { reviewId: String(reviewId) },
      {
        method: "POST",
        action: `/classes/${classId}/review/delete`,
      }
    );
  };
  return (
    <Dialog
      open={isReviewClassDialogOpen}
      onOpenChange={setIsReviewClassDialogOpen}
    >
      <DialogTrigger>
        <Button variant="outline">
          <MessageSquareText
            className={`size-4 ${
              IsReviewed ? "text-red-600 fill-current" : ""
            }`}
          />
        </Button>
      </DialogTrigger>
      {IsReviewed ? (
        <DialogContent>
          <DialogHeader>나의 리뷰</DialogHeader>
          <DialogDescription>
            리뷰를 수정하거나 삭제하시겠습니까?{" "}
          </DialogDescription>

          <fetcher.Form
            method="post"
            action={`/classes/${classId}/review/update`}
          >
            <Input name="review" defaultValue={userReview} />
            <input type="hidden" name="reviewId" value={reviewId} />
            <DialogFooter>
              <Button
                className="bg-primary"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  "수정하기"
                )}
              </Button>
            </DialogFooter>
          </fetcher.Form>

          <Button
            className="bg-primary"
            onClick={handleDelete}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              "삭제하기"
            )}
          </Button>
        </DialogContent>
      ) : (
        <DialogContent>
          <DialogHeader>리뷰 작성</DialogHeader>
          <DialogDescription>
            이 class에 대한 후기를 남겨주세요
          </DialogDescription>
          <fetcher.Form method="POST" action={`/classes/${classId}/review`}>
            <Textarea name="review" className="mb-5" />
            <DialogFooter>
              <Button type="button">취소하기</Button>
              <Button
                className="bg-primary"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  "리뷰 작성하기"
                )}
              </Button>
            </DialogFooter>
          </fetcher.Form>
        </DialogContent>
      )}
    </Dialog>
  );
}
