// ClassMessageBubbleDropdownMenu.tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/common/components/ui/dropdown-menu";
import { Button } from "~/common/components/ui/button";
import { EllipsisVertical } from "lucide-react";
import { useFetcher } from "react-router";
import { useEffect, useState } from "react";

interface Props {
  isDelete: boolean;
  messageId: number;
  onEditClick: () => void;
  isEditing: boolean;
}

export function ClassMessageBubbleDropdownMenu({
  isDelete,
  messageId,
  onEditClick,
  isEditing,
}: Props) {
  const fetcher = useFetcher();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // `isEditing`이 `false`일 때 드롭다운을 닫음
    if (isEditing) {
      setIsOpen(false);
    }
  }, [isEditing]);
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger>
        <EllipsisVertical className="text-gray-400" />
      </DropdownMenuTrigger>
      {isDelete ? (
        <DropdownMenuContent className="flex justify-center items-center py-3">
          <fetcher.Form
            method="post"
            action={`/classes/messages/${messageId}/restore`}
          >
            <Button>복구하기</Button>
          </fetcher.Form>
        </DropdownMenuContent>
      ) : (
        <DropdownMenuContent className="flex flex-col gap-3 p-3 items-center">
          <Button type="button" onClick={onEditClick}>
            수정하기
          </Button>
          <fetcher.Form
            method="post"
            action={`/classes/messages/${messageId}/delete`}
          >
            <Button>삭제하기</Button>
          </fetcher.Form>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
}
