import { useSelector, useDispatch } from "react-redux";
import { closeModal } from "~/store/modalSlice";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogOverlay,
} from "~/common/components/ui/dialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/common/components/ui/avatar";
import { Link, useFetcher } from "react-router";
import { Button } from "~/common/components/ui/button";
import { useOutletContext } from "react-router";
import { Heart } from "lucide-react";
import { cn } from "~/lib/utils";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";

export default function Modal() {
  const { isOpen, selectedVideo } = useSelector((state: any) => state.modal);
  const { userId } = useOutletContext<{
    userId: string;
  }>();
  const dispatch = useDispatch();
  const fetcher = useFetcher();

  const [isLiked, setIsLiked] = useState(selectedVideo?.is_upvoted ?? false);
  const [voteCount, setVoteCount] = useState(selectedVideo?.upvotes ?? 0);
  useEffect(() => {
    if (selectedVideo) {
      setIsLiked(selectedVideo.is_upvoted);
      setVoteCount(selectedVideo.upvotes);
    }
  }, [selectedVideo]);
  if (!isOpen || !selectedVideo) return null;
  const isUploader = selectedVideo.author_id === userId;
  const absordclick = () => {
    setIsLiked((prev: any) => !prev);
    setVoteCount((prev: any) => (isLiked ? prev - 1 : prev + 1));
    fetcher.submit(null, {
      method: "POST",
      action: `/community/videos/${selectedVideo.video_id}/upvote`,
    });
  };
  return (
    <Dialog open={isOpen} onOpenChange={() => dispatch(closeModal())}>
      <DialogOverlay />
      <DialogContent className="max-w-xl space-y-4">
        <div className="flex items-center gap-2">
          <Avatar className="size-14">
            <AvatarFallback>{selectedVideo.author_username}</AvatarFallback>
            <AvatarImage src={selectedVideo.author_avatar} />
          </Avatar>
          <div>
            <DialogTitle className="text-lg font-semibold">
              {selectedVideo.author_username}
            </DialogTitle>
            <span className="text-sm">
              {DateTime.fromISO(selectedVideo.created_at).toRelative()}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-3 items-start">
          <h2 className="text-lg font-semibold">{selectedVideo.title}</h2>
          <p className="text-sm text-gray-500">{selectedVideo.description}</p>
          <div className="flex justify-between w-full">
            <Button onClick={absordclick} variant="outline">
              <Heart
                className={cn(isLiked ? "text-primary fill-primary" : "")}
              />
              <span>{voteCount}</span>
            </Button>
            <div>
              {isUploader && (
                <Link to={`/community/videos/${selectedVideo.video_id}`}>
                  <Button>수정하기</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
        <video className="w-full" controls>
          <source src={selectedVideo.video_url} type="video/mp4" />
        </video>
      </DialogContent>
    </Dialog>
  );
}
