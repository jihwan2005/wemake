// components/notification-buttons.tsx
import { Medal, Ticket } from "lucide-react";
import { Button } from "~/common/components/ui/button";

interface NotificationButtonsProps {
  activeTab: "수료증" | "쿠폰";
  setActiveTab: (tab: "수료증" | "쿠폰") => void;
}

export function MyInventoryButtons({
  activeTab,
  setActiveTab,
}: NotificationButtonsProps) {
  return (
    <div className="flex gap-3">
      <Button
        variant={activeTab === "쿠폰" ? "default" : "outline"}
        size="icon"
        onClick={() => setActiveTab("쿠폰")}
        className="w-1/7"
      >
        <Ticket className="size-4" />
        쿠폰
      </Button>
      <Button
        variant={activeTab === "수료증" ? "default" : "outline"}
        size="icon"
        onClick={() => setActiveTab("수료증")}
        className="w-1/7"
      >
        <Medal className="size-4" />
        수료증
      </Button>
    </div>
  );
}
