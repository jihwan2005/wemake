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

export default function Modal() {
  const { isOpen, selectedVideo } = useSelector((state: any) => state.modal);
  const dispatch = useDispatch();
  console.log(selectedVideo);
  if (!isOpen || !selectedVideo) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => dispatch(closeModal())}>
      <DialogOverlay />
      <DialogContent className="max-w-xl space-y-4">
        <Avatar className="size-14">
          <AvatarFallback>{selectedVideo.author_username}</AvatarFallback>
          <AvatarImage src={selectedVideo.author_avatar} />
        </Avatar>
        <h2 className="text-lg font-semibold">{selectedVideo.title}</h2>
        <p className="text-sm text-gray-500">{selectedVideo.description}</p>
        <video className="w-full" controls>
          <source src={selectedVideo.video_url} type="video/mp4" />
        </video>
      </DialogContent>
    </Dialog>
  );
}
