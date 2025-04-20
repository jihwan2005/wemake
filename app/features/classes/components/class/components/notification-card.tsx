import { XCircle, Check } from "lucide-react";
import { DateTime } from "luxon";
import { useFetcher } from "react-router";

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

interface NotificationCardProps {
  notification: Notification;
}

export function NotificationCard({ notification }: NotificationCardProps) {
  const fetcher = useFetcher();

  const actionPath = `/classes/${notification.notification_id}`;

  const renderContent = () => {
    if (notification.type === "upload") {
      return `📌 ${notification.source?.name} 님이 새로운 레슨을 업로드했어요`;
    } else if (notification.type === "upload-notify") {
      return `📌 ${notification.source?.name} 님이 새로운 공지 사항을 업로드했어요`;
    } else if (notification.type === "enrollment") {
      return `🎉 ${notification.class_title} 강의에 오신 걸 환영합니다!`;
    } else if (notification.type === "complete") {
      return `🎉 ${notification.class_title} 레슨을 완료했어요!`;
    } else if (notification.type === "complete-goal") {
      return `🎉 모든 목표를 완수했어요! 부라보!!`;
    }
    return null;
  };

  return (
    <div className="flex items-center gap-2 shadow-md rounded-md p-2">
      <div className="flex items-center gap-2 justify-between w-full">
        <div className="flex flex-col gap-1 w-full">
          <div className="flex justify-between items-center w-full">
            <span>{renderContent()}</span>
            {notification.seen ? (
              <fetcher.Form method="post" action={`${actionPath}/delete`}>
                <button>
                  <XCircle className="size-4" />
                </button>
              </fetcher.Form>
            ) : (
              <fetcher.Form method="post" action={`${actionPath}/see`}>
                <button>
                  <Check className="size-4" />
                </button>
              </fetcher.Form>
            )}
          </div>
          <span className="text-sm text-gray-400">
            {DateTime.fromISO(notification.created_at ?? "").toRelative()}
          </span>
        </div>
      </div>
    </div>
  );
}
