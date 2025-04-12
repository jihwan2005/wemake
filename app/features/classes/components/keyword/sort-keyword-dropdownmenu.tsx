import { ChevronDownIcon } from "lucide-react";
import { useSearchParams } from "react-router";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/common/components/ui/dropdown-menu";
import { SearchOptions } from "../../constants";

export default function SortKeywordDropdownMenu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const sorting = searchParams.get("sorting") || "title";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1 mb-5">
        <span className="text-sm capitalize">{sorting}</span>
        <ChevronDownIcon className="size-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {SearchOptions.map((option) => (
          <DropdownMenuCheckboxItem
            className="capitalize cursor-pointer"
            key={option}
            onCheckedChange={(checked: boolean) => {
              if (checked) {
                searchParams.set("sorting", option);
                setSearchParams(searchParams);
              }
            }}
          >
            {option}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
