import * as motion from "motion/react-client";
import { DateTime } from "luxon";

type myNotify = {
  class_post_id: number;
  created_at: string;
  notify_id: number;
  notify_title: string;
  notify_content: string | null;
  profile_id: string;
};

interface NotifyCardProps {
  notify: myNotify;
  onClick: () => void;
}

export function NotifyCard({ notify, onClick }: NotifyCardProps) {
  return (
    <motion.div
      key={notify.notify_id}
      layoutId={notify.notify_id + ""}
      className="shadow-md rounded-md p-2 cursor-pointer bg-white"
      onClick={onClick}
    >
      <div className="flex items-center gap-2 justify-between w-full">
        <div className="flex flex-col gap-1">
          <span>📢 {notify.notify_title}</span>
          <span className="text-sm text-gray-400">
            {DateTime.fromISO(notify.created_at).toRelative()}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
