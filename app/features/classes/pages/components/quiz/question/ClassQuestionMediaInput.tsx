import { Button } from "~/common/components/ui/button";
import { ImageIcon, Video } from "lucide-react";

type Props = {
  onClickImage?: () => void;
  onClickVideo?: () => void;
};

export default function ClassQuestionMediaInput({
  onClickImage,
  onClickVideo,
}: Props) {
  return (
    <div className="mt-10 flex flex-col gap-3">
      <span className="font-semibold">사진 / 동영상 첨부</span>
      <div className="flex items-center gap-2">
        <Button type="button" onClick={onClickImage}>
          <ImageIcon className="size-4" />
        </Button>
        <Button type="button" onClick={onClickVideo}>
          <Video className="size-4" />
        </Button>
      </div>
    </div>
  );
}
