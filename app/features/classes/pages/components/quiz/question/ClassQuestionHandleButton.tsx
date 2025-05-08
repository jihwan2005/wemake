import { Button } from "~/common/components/ui/button";
import { LoaderCircle } from "lucide-react";

type ClassQuestionHandleButtonProps = {
  isSubmitting: boolean;
  onDelete: () => void;
  hasQuestionId: boolean;
};

export default function ClassQuestionHandleButton({
  isSubmitting,
  onDelete,
  hasQuestionId,
}: ClassQuestionHandleButtonProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        type="submit"
        className="w-fit self-center"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <LoaderCircle className="animate-spin" />
        ) : hasQuestionId ? (
          "퀴즈 수정"
        ) : (
          "퀴즈 저장"
        )}
      </Button>
      <Button
        type="button"
        onClick={() => {
          if (confirm("정말 이 퀴즈를 삭제하시겠습니까?")) {
            onDelete();
          }
        }}
      >
        퀴즈 삭제
      </Button>
    </div>
  );
}
