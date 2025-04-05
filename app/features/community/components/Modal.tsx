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
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";

export default function Modal() {
  const { isOpen, selectedVideo } = useSelector((state: any) => state.modal);
  const { userId } = useOutletContext<{
    userId: string;
  }>();
  const dispatch = useDispatch();
  const fetcher = useFetcher();
  const [isLiked, setIsLiked] = useState(selectedVideo?.is_upvoted ?? false);
  const [voteCount, setVoteCount] = useState(selectedVideo?.upvotes ?? 0);
  const [showComments, setShowComments] = useState(false);
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
      <DialogContent
        className={cn(
          "max-w-xl space-y-4 overflow-hidden",
          showComments && "p-0"
        )}
      >
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
            <button onClick={absordclick} className="flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ stiffness: 300 }}
              >
                <Heart
                  className={cn(isLiked ? "text-primary fill-primary" : "")}
                />
              </motion.div>
              <span>{voteCount}</span>
            </button>
            <div>
              {isUploader && (
                <Link to={`/community/videos/${selectedVideo.video_id}`}>
                  <Button>수정하기</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
        <motion.div
          animate={{ y: showComments ? -250 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="relative z-10"
        >
          <video className="w-full rounded-md shadow-md" controls>
            <source src={selectedVideo.video_url} type="video/mp4" />
          </video>
        </motion.div>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setShowComments(true)}
        >
          댓글 보기
        </Button>
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute bottom-0 left-0 w-full bg-background border-t rounded-t-xl z-50 h-[350px] no-scrollbar"
              style={{ height: "50%", overflowY: "auto" }}
            >
              <div className="flex justify-between items-center mb-2 sticky top-0 bg-background z-10 shadow-md p-4">
                <h3 className="font-semibold text-sm">댓글</h3>
                <button onClick={() => setShowComments(false)}>닫기</button>
              </div>
              <div className="space-y-2">
                <p>댓글1</p>
                <p>댓글2</p>
                <p>댓글3</p>
                <p>댓글3</p>
                <p>댓글3</p>
                <p>댓글3</p>
                <p>댓글3</p>
                <p>댓글3</p>
                <p>댓글3</p>
                <p>댓글3</p>
                <p>댓글3</p>
                <p>댓글3</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
