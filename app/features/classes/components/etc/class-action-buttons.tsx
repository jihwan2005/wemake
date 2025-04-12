import { List, EyeOff } from "lucide-react";
import { Button } from "~/common/components/ui/button";
import UpdateClassDialog from "~/features/classes/components/class/update-class-dialog";
import DeleteClassDialog from "~/features/classes/components/class/delete-class-dialog";
import CreateChapterDialog from "~/features/classes/components/chapter/create-chapter-dialog";

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
}

export default function ClassActionButtons({
  authorId,
  userId,
  cls,
  isOpen,
  setIsOpen,
}: Props) {
  return (
    <div className="flex flex-col gap-4 w-1/7">
      {authorId === userId && (
        <div className="flex gap-3 items-center">
          <UpdateClassDialog cls={cls} />
          <DeleteClassDialog />
        </div>
      )}
      <div className="flex gap-4">
        {authorId === userId && <CreateChapterDialog />}
        <Button variant="outline" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <EyeOff className="size-4" /> : <List className="size-4" />}
        </Button>
      </div>
    </div>
  );
}
