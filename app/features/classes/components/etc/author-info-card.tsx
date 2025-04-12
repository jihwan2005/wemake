import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/common/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/common/components/ui/hover-card";
import { GraduationCap, Mail } from "lucide-react";
import { Link } from "react-router";

type AuthorInfoCardProps = {
  username: string;
  avatarUrl?: string | null;
  email?: string;
};

export default function AuthorInfoCard({
  username,
  avatarUrl,
  email,
}: AuthorInfoCardProps) {
  return (
    <div className="flex mb-5 items-center gap-2">
      <Avatar className="size-14">
        <AvatarFallback>{username[0]}</AvatarFallback>
        {avatarUrl && <AvatarImage src={avatarUrl} />}
      </Avatar>
      <div className="flex flex-col">
        <div className="flex gap-2 items-center">
          <GraduationCap className="size-5" />
          <Link to={`/users/${username}`}>
            <span>{username}</span>
          </Link>
        </div>
        <div className="flex gap-2 items-center">
          <Mail className="size-4" />
          <HoverCard>
            <HoverCardTrigger asChild>
              <span className="underline cursor-pointer">{email}</span>
            </HoverCardTrigger>
            <HoverCardContent>
              <span>
                If you have any questions, feel free to reach out via email.
              </span>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
    </div>
  );
}
