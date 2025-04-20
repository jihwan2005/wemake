// components/notification-buttons.tsx
import { Button } from "~/common/components/ui/button";

interface NotificationButtonsProps {
  activeTab: "notify" | "alert";
  setActiveTab: (tab: "notify" | "alert") => void;
}

export function NotificationButtons({
  activeTab,
  setActiveTab,
}: NotificationButtonsProps) {
  return (
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
  );
}
