import { useSelector, useDispatch } from "react-redux";
import { closeModal } from "~/store/modalSlice";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
} from "~/common/components/ui/dialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/common/components/ui/avatar";
import { Link } from "react-router";
import { Button } from "~/common/components/ui/button";

export default function Modal() {
  const { isOpen, selectedVideo } = useSelector((state: any) => state.modal);
  const dispatch = useDispatch();
  if (!isOpen || !selectedVideo) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => dispatch(closeModal())}>
      <DialogOverlay />
      <DialogContent className="max-w-xl space-y-4">
        <div className="flex justify-between items-center">
          <Avatar className="size-14">
            <AvatarFallback>{selectedVideo.author_username}</AvatarFallback>
            <AvatarImage src={selectedVideo.author_avatar} />
          </Avatar>
          <Link to={`/community/videos/${selectedVideo.video_id}`}>
            <Button>수정하기</Button>
          </Link>
        </div>
        <h2 className="text-lg font-semibold">{selectedVideo.title}</h2>
        <p className="text-sm text-gray-500">{selectedVideo.description}</p>
        <video className="w-full" controls>
          <source src={selectedVideo.video_url} type="video/mp4" />
        </video>
      </DialogContent>
    </Dialog>
  );
}
