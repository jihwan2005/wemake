import { Search } from "lucide-react";
import { Button } from "~/common/components/ui/button";

interface ClassMessageSearchProps {
  searchText: string;
  setSearchText: (text: string) => void;
  searchAndScroll: () => void;
}

export default function ClassMessageSearch({
  searchText,
  setSearchText,
  searchAndScroll,
}: ClassMessageSearchProps) {
  return (
    <div className="w-full bg-white py-2">
      <div className="flex justify-end items-center gap-2 w-fit ml-auto">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="메시지 검색..."
          className="border p-2"
        />
        <Button onClick={searchAndScroll}>
          <Search className="size-4" />
        </Button>
      </div>
    </div>
  );
}
