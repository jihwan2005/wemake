import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "~/common/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/common/components/ui/accordion";
import { Button } from "~/common/components/ui/button";
import { Megaphone } from "lucide-react";
import { DateTime } from "luxon";

type ClassMessageNotificationProps = {
  notifications: {
    notification_id: number;
    notification_title: string;
    notification_content: string;
    created_at: string;
  }[];
};

export default function ClassMessageNotification({
  notifications,
}: ClassMessageNotificationProps) {
  return (
    <Dialog>
      <DialogTrigger>
        <Button>
          <Megaphone className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full">
        <div className="flex justify-center">
          <span className="text-2xl">📢공지사항</span>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center text-sm text-gray-500 mt-4">
            아직 공지사항이 없어요!
          </div>
        ) : (
          <Accordion type="single" collapsible>
            {notifications.map((notification) => (
              <AccordionItem
                value={notification.notification_id.toString()}
                key={notification.notification_id}
              >
                <AccordionTrigger>
                  {notification.notification_title}
                </AccordionTrigger>
                <AccordionContent className="flex justify-between">
                  <p>{notification.notification_content}</p>
                  <span className="text-sm text-gray-400">
                    {DateTime.fromISO(notification.created_at).toRelative()}
                  </span>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </DialogContent>
    </Dialog>
  );
}
