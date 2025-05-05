// ClassMessageHeader.tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/common/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/common/components/ui/avatar";
import { DateTime } from "luxon";

interface ClassMessageHeaderProps {
  avatarUrl: string;
  avatarFallback: string;
  name: string;
  createdAt: string;
  messagesCount: number;
}

const ClassMessageHeader: React.FC<ClassMessageHeaderProps> = ({
  avatarUrl,
  avatarFallback,
  name,
  createdAt,
  messagesCount,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="size-14">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-0">
          <CardTitle className="text-xl">{name}</CardTitle>
          <CardDescription>
            {messagesCount > 0
              ? DateTime.fromISO(createdAt, { zone: "utc" })
                  .toLocal()
                  .setLocale("ko")
                  .toRelative()
              : "No messages"}
          </CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
};

export default ClassMessageHeader;
