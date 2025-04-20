import * as motion from "motion/react-client";
import { DateTime } from "luxon";
import { Button } from "~/common/components/ui/button";
import { X } from "lucide-react";
import NotifyUpdateDialog from "./notify-update-dialog";
import NotifyDeleteDialog from "./notify-delete-dialog";

type myNotify = {
  class_post_id: number;
  created_at: string;
  notify_id: number;
  notify_title: string;
  notify_content: string | null;
  profile_id: string;
};

interface NotifyModalProps {
  selected: myNotify;
  onClose: () => void;
  classId: string;
  authorId?: string;
  userId?: string;
}

export function NotifyModal({
  selected,
  onClose,
  classId,
  authorId,
  userId,
}: NotifyModalProps) {
  return (
    <motion.div
      layoutId={selected.notify_id + ""}
      className="z-50 bg-white p-6 rounded-xl shadow-2xl"
      style={{
        position: "absolute",
        width: "90%",
        height: "90%",
        top: "5%",
        left: "5%",
        right: "5%",
        bottom: "5%",
      }}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">📢 {selected.notify_title}</h2>
          <div className="flex gap-2">
            <NotifyUpdateDialog
              title={selected.notify_title}
              content={selected.notify_content}
              classId={classId}
              notifyId={selected.notify_id}
              authorId={authorId}
              userId={userId}
            />
            <NotifyDeleteDialog
              title={selected.notify_title}
              classId={classId}
              notifyId={selected.notify_id}
              authorId={authorId}
              userId={userId}
            />
            <Button variant="outline" onClick={onClose}>
              <X className="size-4" />
            </Button>
          </div>
        </div>

        <p className="text-gray-500 text-sm">
          {DateTime.fromISO(selected.created_at).toRelative()}
        </p>
        <p>{selected.notify_content}</p>
      </div>
    </motion.div>
  );
}
