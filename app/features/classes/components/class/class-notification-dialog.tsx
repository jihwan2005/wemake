import { Bell, Check, XCircle } from "lucide-react";
import { useState } from "react";
import { useFetcher } from "react-router";
import { Button } from "~/common/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/common/components/ui/dialog";
import { Input } from "~/common/components/ui/input";
import { DateTime } from "luxon";

type Notification = {
  notification_id: number | null;
  type: "upload" | "upload-notify" | "enrollment" | null;
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

type notify = {
  class_post_id: number;
  created_at: string;
  notify_id: number;
  notify_text: string;
  profile_id: string;
  notification_id: number;
  seen: boolean;
};

interface ClassNotificationDialogProps {
  authorId: string;
  userId: string;
  classId: string;
  notifications: Notification[];
  notifies: notify[];
}

export default function ClassNotificationDialog({
  authorId,
  userId,
  notifications,
  classId,
  notifies,
}: ClassNotificationDialogProps) {
  const hasUnread = notifications.some((n) => !n.seen);
  const fetcher = useFetcher();
  const [activeTab, setActiveTab] = useState<"notify" | "alert">("alert");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Bell
            className={`size-4 ${hasUnread ? "text-red-500 fill-red-500" : ""}`}
          />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Notifications</DialogTitle>
          <div className="flex gap-3">
            <Button
              variant={activeTab === "alert" ? "default" : "outline"}
              size="icon"
              onClick={() => setActiveTab("alert")}
              className="w-1/7"
            >
              알림
            </Button>
            <Button
              variant={activeTab === "notify" ? "default" : "outline"}
              size="icon"
              onClick={() => setActiveTab("notify")}
              className="w-1/7"
            >
              공지사항
            </Button>
          </div>
        </DialogHeader>
        {activeTab === "alert" && (
          <div className="flex flex-col gap-3 max-h-96 overflow-y-auto pr-2">
            {notifications.map((n) => (
              <div
                key={n.notification_id}
                className="flex items-center gap-2 shadow-md rounded-md p-2"
              >
                <div className="flex items-center gap-2 justify-between w-full">
                  <div className="flex flex-col gap-1 w-full">
                    {n.type === "upload" ? (
                      <div className="flex justify-between items-center w-full">
                        <span>
                          📌 {n.source?.name} 님이 새로운 레슨을 업로드했어요
                        </span>
                        {n.seen ? (
                          <fetcher.Form
                            method="post"
                            action={`/classes/${n.notification_id}/delete`}
                          >
                            <button>
                              <XCircle className="size-4" />
                            </button>
                          </fetcher.Form>
                        ) : (
                          <fetcher.Form
                            method="post"
                            action={`/classes/${n.notification_id}/see`}
                          >
                            <button>
                              <Check className="size-4" />
                            </button>
                          </fetcher.Form>
                        )}
                      </div>
                    ) : n.type === "upload-notify" ? (
                      <div className="flex justify-between items-center w-full">
                        <span>
                          📌 {n.source?.name} 님이 새로운 공지 사항을
                          업로드했어요
                        </span>
                        {n.seen ? (
                          <fetcher.Form
                            method="post"
                            action={`/classes/${n.notification_id}/delete`}
                          >
                            <button>
                              <XCircle className="size-4" />
                            </button>
                          </fetcher.Form>
                        ) : (
                          <fetcher.Form
                            method="post"
                            action={`/classes/${n.notification_id}/see`}
                          >
                            <button>
                              <Check className="size-4" />
                            </button>
                          </fetcher.Form>
                        )}
                      </div>
                    ) : n.type === "enrollment" ? (
                      <div className="flex justify-between items-center w-full">
                        <span>
                          🎉 {n.class_title} 강의에 오신 걸 환영합니다!
                        </span>
                        {n.seen ? (
                          <fetcher.Form
                            method="post"
                            action={`/classes/${n.notification_id}/delete`}
                          >
                            <button>
                              <XCircle className="size-4" />
                            </button>
                          </fetcher.Form>
                        ) : (
                          <fetcher.Form
                            method="post"
                            action={`/classes/${n.notification_id}/see`}
                          >
                            <button>
                              <Check className="size-4" />
                            </button>
                          </fetcher.Form>
                        )}
                      </div>
                    ) : null}
                    <span className="text-sm text-gray-400">
                      {DateTime.fromISO(n.created_at ?? "").toRelative()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "notify" && (
          <div className="flex flex-col gap-1 max-h-96 overflow-y-auto pr-2">
            {authorId === userId && (
              <fetcher.Form method="post" action={`/classes/${classId}`}>
                <input
                  type="hidden"
                  name="actionType"
                  value="create-notification"
                />
                <Input
                  className="bg-white mb-3"
                  id="notification"
                  name="notification"
                />
                <Button className="mb-3">공지사항 올리기</Button>
              </fetcher.Form>
            )}
            <div className="flex flex-col gap-3">
              {notifies.map((n) => (
                <div key={n.notify_id} className="shadow-md  rounded-md p-2">
                  <div className="flex items-center gap-2 justify-between w-full">
                    <div className="flex flex-col gap-1">
                      <span>📢 {n.notify_text}</span>
                      <span className="text-sm text-gray-400">
                        {DateTime.fromISO(n.created_at).toRelative()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
