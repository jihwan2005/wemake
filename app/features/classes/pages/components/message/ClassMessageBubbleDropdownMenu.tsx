// ClassMessageBubbleDropdownMenu.tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/common/components/ui/dropdown-menu";
import { Button } from "~/common/components/ui/button";
import { EllipsisVertical } from "lucide-react";
import { useFetcher, useOutletContext } from "react-router";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "~/common/components/ui/dialog";
import { Checkbox } from "~/common/components/ui/checkbox";

interface Props {
  isDelete: boolean;
  messageId: number;
  onEditClick: () => void;
  isEditing: boolean;
  content: string;
  onlineUsers: number;
}

export function ClassMessageBubbleDropdownMenu({
  isDelete,
  messageId,
  onEditClick,
  isEditing,
  content,
  onlineUsers,
}: Props) {
  const fetcher = useFetcher();
  const [isOpen, setIsOpen] = useState(false);
  const { username } = useOutletContext<{
    username: { roomId: number; username: string }[];
  }>();
  useEffect(() => {
    // `isEditing`이 `false`일 때 드롭다운을 닫음
    if (isEditing) {
      setIsOpen(false);
    }
  }, [isEditing]);
  const [selectedRooms, setSelectedRooms] = useState<number[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const toggleRoom = (roomId: number) => {
    setSelectedRooms((prev) =>
      prev.includes(roomId)
        ? prev.filter((id) => id !== roomId)
        : [...prev, roomId]
    );
  };

  useEffect(() => {
    if (fetcher.state === "idle") {
      setDialogOpen(false); // 폼 제출 후 Dialog 닫기
    }
  }, [fetcher.state]);

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
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger>
              <Button>전달하기</Button>
            </DialogTrigger>
            <DialogContent className="w-full">
              <div className="flex justify-center">
                <span className="text-2xl">누구한테 전달하시겠어요?</span>
              </div>
              <span>전달할 내용 : {content}</span>
              {username.map((name) => (
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedRooms.includes(name.roomId)}
                    onCheckedChange={() => toggleRoom(name.roomId)}
                  />
                  <div>{name.username}</div>
                </div>
              ))}
              {selectedRooms.length > 0 && (
                <fetcher.Form method="post" action="/classes/messages/deliver">
                  <input type="hidden" name="content" value={content} />
                  <input
                    type="hidden"
                    name="isRead"
                    value={onlineUsers > 1 ? "true" : "false"}
                  />
                  {selectedRooms.map((roomId) => {
                    const isRead = onlineUsers > 1 ? "true" : "false";
                    return (
                      <input
                        key={roomId}
                        type="hidden"
                        name="roomAndIsRead"
                        value={`${roomId}:${isRead}`}
                      />
                    );
                  })}
                  <Button type="submit">전달하기</Button>
                </fetcher.Form>
              )}
            </DialogContent>
          </Dialog>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
}
