// ClassMessageDate.tsx
import { CalendarIcon } from "lucide-react";
import { DateTime } from "luxon";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/common/components/ui/popover";
import { Calendar } from "~/common/components/ui/calendar";

interface ClassMessageDateProps {
  date: string;
  rawDate: string;
  messages: { read_at: string }[];
  dateRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
}

const ClassMessageDate: React.FC<ClassMessageDateProps> = ({
  date,
  rawDate,
  messages,
  dateRefs,
}) => {
  return (
    <div
      ref={(el) => {
        const dateKey = DateTime.fromISO(rawDate).toISODate();
        dateRefs.current[dateKey!] = el;
      }}
      className="flex items-center my-4 px-4 gap-2"
    >
      <div className="flex-grow border-t border-gray-300" />

      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger className="p-1 hover:bg-gray-100 rounded">
            <CalendarIcon className="h-4 w-4 text-gray-500" />
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={DateTime.fromISO(rawDate).toJSDate()}
              onSelect={(selectedDate) => {
                const iso = DateTime.fromJSDate(selectedDate!).toISODate();
                const el = dateRefs.current[iso!];
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }}
              disabled={(selectedDate) => {
                const iso = DateTime.fromJSDate(selectedDate).toISODate();
                return !messages.some(
                  (msg) => DateTime.fromISO(msg.read_at).toISODate() === iso
                );
              }}
            />
          </PopoverContent>
        </Popover>
        <span className="text-xs text-gray-500 whitespace-nowrap">{date}</span>
      </div>

      <div className="flex-grow border-t border-gray-300" />
    </div>
  );
};

export default ClassMessageDate;
