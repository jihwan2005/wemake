import { Bell } from "lucide-react";
import { useState } from "react";
import { Button } from "~/common/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/common/components/ui/dialog";
import { AnimatePresence } from "motion/react";
import { NotificationCard } from "./components/notification-card";
import { NotifyCard } from "./components/notify-card";
import { NotificationInput } from "./components/notification-input";
import { NotificationButtons } from "./components/notification-buttons";
import { NotifyModal } from "./components/notify-modal";

type Notification = {
  notification_id: number | null;
  type:
    | "upload"
    | "upload-notify"
    | "enrollment"
    | "complete"
    | "complete-goal"
    | null;
  source: {
    profile_id: string;
    name: string;
    avatar: string | null;
  } | null;
  lesson: {
    lesson_id: string | null;
    title: string | null;
  } | null;
  class_title: string | null;
  seen: boolean | null;
  created_at: string | null;
};

type myNotify = {
  class_post_id: number;
  created_at: string;
  notify_id: number;
  notify_title: string;
  notify_content: string | null;
  profile_id: string;
};

interface ClassNotificationDialogProps {
  authorId: string;
  userId: string;
  classId: string;
  notifications: Notification[];
  notify: myNotify[];
}

export default function ClassNotificationDialog({
  authorId,
  userId,
  notifications,
  classId,
  notify,
}: ClassNotificationDialogProps) {
  const hasUnread = notifications.some((n) => !n.seen);
  const [activeTab, setActiveTab] = useState<"notify" | "alert">("alert");
  const [selected, setSelected] = useState<myNotify | null>(null);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Bell
            className={`size-4 ${hasUnread ? "text-red-500 fill-red-500" : ""}`}
          />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col h-[80vh] p-6">
        <DialogHeader>
          <DialogTitle>Notifications</DialogTitle>
          <NotificationButtons
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </DialogHeader>
        {activeTab === "alert" && (
          <div className="flex flex-col gap-3 max-h-96 overflow-y-auto pb-3">
            {notifications.map((n) => (
              <NotificationCard key={n.notification_id} notification={n} />
            ))}
          </div>
        )}
        {activeTab === "notify" && (
          <div className="flex flex-col gap-1 max-h-96 overflow-y-auto pb-3">
            {authorId === userId && <NotificationInput classId={classId} />}
            <>
              <div className="flex flex-col gap-3">
                {notify.map((n) => (
                  <NotifyCard
                    key={n.notify_id}
                    notify={n}
                    onClick={() => setSelected(n)}
                  />
                ))}
              </div>

              <AnimatePresence>
                {selected && (
                  <NotifyModal
                    selected={selected}
                    onClose={() => setSelected(null)}
                    classId={classId}
                    authorId={authorId}
                    userId={userId}
                  />
                )}
              </AnimatePresence>
            </>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
