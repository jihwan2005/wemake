import { ChevronDownIcon } from "lucide-react";
import { useSearchParams } from "react-router";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/common/components/ui/dropdown-menu";
import { SortOptions } from "../../constants/constants";

export default function OrderClassDropdownMenu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const order = searchParams.get("order") || "upvotes";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1">
        <span className="text-sm capitalize">{order}</span>
        <ChevronDownIcon className="size-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {SortOptions.map((option) => (
          <DropdownMenuCheckboxItem
            className="capitalize cursor-pointer"
            key={option}
            onCheckedChange={(checked: boolean) => {
              if (checked) {
                searchParams.set("order", option);
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
