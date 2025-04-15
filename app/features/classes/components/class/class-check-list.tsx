import { ListCheck } from "lucide-react";

export default function ClassCheckList() {
  return (
    <div className="w-full bg-gray-300 rounded-2xl text-center min-h-[200px]">
      <div className="pt-5 text-[20px] flex items-center gap-2 justify-center">
        <ListCheck className="size-6" />
        <span>오늘의 목표</span>
      </div>
    </div>
  );
}
