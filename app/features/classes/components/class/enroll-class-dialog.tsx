import { BookmarkPlus, LoaderCircle } from "lucide-react";
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

export default function EnrollClassDialog({
  title,
  classId,
  IsEnrolled,
}: {
  title: string;
  classId: number;
  IsEnrolled: boolean;
}) {
  const fetcher = useFetcher();
  const navigation = useNavigation();
  const [isEnrollClassDialogOpen, setIsEnrollClassDialogOpen] = useState(false);
  const isSubmitting =
    navigation.state === "submitting" || navigation.state === "loading";
  const absordclick = () => {
    fetcher.submit(null, {
      method: "POST",
      action: `/classes/${classId}/enroll`,
    });
  };
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.ok) {
      setIsEnrollClassDialogOpen(false);
    }
  }, [fetcher.state, fetcher.data]);
  return (
    <Dialog
      open={isEnrollClassDialogOpen}
      onOpenChange={setIsEnrollClassDialogOpen}
    >
      <DialogTrigger asChild>
        {IsEnrolled ? (
          <Button>등록됨!</Button>
        ) : (
          <Button>
            <BookmarkPlus className="size-5" />
            <span className="text-lg">Enroll</span>
          </Button>
        )}
      </DialogTrigger>
      {IsEnrolled ? (
        <DialogContent>
          <DialogHeader>Unenroll Class</DialogHeader>
          <DialogDescription>
            {title} Class를 취소하시겠습니까? 기존의 추천과 리뷰는 삭제됩니다
          </DialogDescription>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => setIsEnrollClassDialogOpen(false)}
            >
              취소하기
            </Button>
            <Button
              className="bg-primary"
              disabled={isSubmitting}
              onClick={absordclick}
            >
              {isSubmitting ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                "등록 취소하기"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      ) : (
        <DialogContent>
          <DialogHeader>Enroll Class</DialogHeader>
          <DialogDescription>
            {title} Class를 등록하시겠습니까?
          </DialogDescription>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => setIsEnrollClassDialogOpen(false)}
            >
              취소하기
            </Button>
            <Button
              className="bg-primary"
              disabled={isSubmitting}
              onClick={absordclick}
            >
              {isSubmitting ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                "등록하기"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}
