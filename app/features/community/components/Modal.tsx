import { useSelector, useDispatch } from "react-redux";
import { closeModal, updateSelectedVideo } from "~/store/modalSlice";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/common/components/ui/popover";
import { Link, useFetcher } from "react-router";
import { Button } from "~/common/components/ui/button";
import { useOutletContext } from "react-router";
import { Heart, Send, MoreVertical, Pencil, Trash } from "lucide-react";
import { cn } from "~/lib/utils";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";
import { Input } from "~/common/components/ui/input";

export default function Modal() {
  const { isOpen, selectedVideo } = useSelector((state: any) => state.modal);
  const { userId, username, avatar } = useOutletContext<{
    userId: string;
    username: string;
    avatar: string;
  }>();
  const dispatch = useDispatch();
  const fetcher = useFetcher();
  const [isLiked, setIsLiked] = useState(selectedVideo?.is_upvoted ?? false);
  const [voteCount, setVoteCount] = useState(selectedVideo?.upvotes ?? 0);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
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
  const sendReply = async () => {
    const formData = new FormData();
    formData.append("reply", comment);
    fetcher.submit(formData, {
      method: "POST",
      action: `/community/videos/${selectedVideo.video_id}/reply`,
    });
    setComment("");
  };
  const deleteReply = (replyId: string) => {
    const formData = new FormData();
    formData.append("reply_id", String(replyId));
    fetcher.submit(formData, {
      method: "POST",
      action: `/community/videos/${selectedVideo.video_id}/delete`,
    });
    const updatedComments = selectedVideo.comments.filter(
      (c: any) => c.video_reply_id !== replyId
    );

    dispatch(
      updateSelectedVideo({
        ...selectedVideo,
        comments: updatedComments,
      })
    );
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
              className="absolute bottom-0 left-0 w-full bg-background border-t rounded-t-xl z-50 h-[350px] flex flex-col p-0 m-0"
              style={{ height: "50%" }}
            >
              {/* 헤더 */}
              <div
                className="flex justify-between items-center mb-2 sticky top-0 bg-background z-10 shadow-md p-4"
                style={{
                  willChange: "transform",
                  transform: "translateZ(0)",
                }}
              >
                <h3 className="font-semibold text-sm">댓글</h3>
                <button onClick={() => setShowComments(false)}>닫기</button>
              </div>

              {/* 댓글 리스트 */}
              <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
                {selectedVideo.comments && selectedVideo.comments.length > 0 ? (
                  selectedVideo.comments.map((reply: any) => (
                    <div key={reply.reply_id} className="text-sm border-b pb-2">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2 mb-1">
                          <Avatar className="size-6">
                            <AvatarImage src={reply.author_avatar} />
                            <AvatarFallback>
                              {reply.author_username}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">
                            {reply.author_username}
                          </span>
                          <span className="text-xs text-gray-400">
                            {DateTime.fromISO(reply.created_at).toRelative()}
                          </span>
                        </div>
                        <div>
                          <Popover>
                            <PopoverTrigger asChild>
                              <MoreVertical className="size-6" />
                            </PopoverTrigger>
                            <PopoverContent className="w-35 h-30 flex flex-col gap-2 items-center">
                              <div className="flex items-center gap-4">
                                <Button>
                                  <Pencil className="size-5" />
                                  <span>수정하기</span>
                                </Button>
                              </div>
                              <div className="flex items-center gap-4">
                                <Button
                                  onClick={() =>
                                    deleteReply(reply.video_reply_id)
                                  }
                                >
                                  <Trash className="size-5" />
                                  <span>삭제하기</span>
                                </Button>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                      <p>{reply.reply}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">아직 댓글이 없습니다.</p>
                )}
              </div>

              {/* 댓글 입력창 */}
              <div className="border-t p-3 flex items-center gap-4 bg-background">
                <Input
                  className="h-10"
                  placeholder="댓글 작성하기"
                  id="reply"
                  name="reply"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <Button onClick={sendReply}>
                  <Send className="size-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
