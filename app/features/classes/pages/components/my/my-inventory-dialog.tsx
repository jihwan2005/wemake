import { Backpack } from "lucide-react";
import { useState } from "react";
import { Button } from "~/common/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/common/components/ui/dialog";
import { MyInventoryButtons } from "./my-inventory-buttons";

type CertificateProps = {
  certificates: {
    class_post_id: number;
    class_title: string;
    issued_at: string;
    profile_id: string;
    username: string;
    completion_rank: number;
    completion_duration: string;
  }[];
};
export default function MyInventoryDialog({ certificates }: CertificateProps) {
  const [activeTab, setActiveTab] = useState<"수료증" | "쿠폰">("쿠폰");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Backpack className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-3">내 인벤토리</DialogTitle>
          <MyInventoryButtons
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </DialogHeader>
        {activeTab === "수료증" && (
          <div className="flex flex-col gap-5 overflow-y-auto">
            {certificates.map((certificate) => (
              <div className="bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 border-2 rounded-xl flex flex-col gap-3 w-full p-5">
                <div className="w-full flex justify-center">
                  <span className="text-4xl font-bold text-white">수료증</span>
                </div>
                <div className="w-full flex justify-end pr-5">
                  <span className="text-3xl font-semibold text-white">
                    {certificate.username}
                  </span>
                </div>
                <span className="text-white">
                  귀하는 {certificate.class_title}과정을{" "}
                  {certificate.completion_duration}동안 완벽하게 이수하였기에 이
                  수료증을 수여합니다. {certificate.completion_rank}번 째로 위
                  과정을 완수하였습니다.
                </span>
                <div className="w-full flex justify-end">
                  <span className="text-sm text-white">
                    {certificate.issued_at.split("T")[0]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === "쿠폰" && <div>쿠폰</div>}
      </DialogContent>
    </Dialog>
  );
}
