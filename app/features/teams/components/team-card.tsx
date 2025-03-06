import { Link } from "react-router";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { Badge } from "~/common/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/common/components/ui/avatar";
import { Button } from "~/common/components/ui/button";

interface TeamCardProps {
  id: string;
  leaderUsername: string;
  leaderAvatarUrl: string;
  positions: string[];
  projectDescription: string;
}

export function TeamCard({
  id,
  leaderUsername,
  leaderAvatarUrl,
  positions,
  projectDescription,
}: TeamCardProps) {
  return (
    <Link to={`/teams/${id}`}>
      <Card className="bg-transparent hover:bg-card/50 transition-colors">
        <CardHeader className="flex flex-row items-center">
          <CardTitle className="text-base leading-loose">
            <Badge
              variant={"secondary"}
              className="inline-flex shadow-sm items-center text-base"
            >
              <span>@{leaderUsername}</span>
              <Avatar className="size-5">
                <AvatarFallback>{leaderUsername[0]}</AvatarFallback>
                <AvatarImage src={leaderAvatarUrl} />
              </Avatar>
            </Badge>
            <span> is looking for </span>
            {positions.map((position, index) => (
              <Badge key={index} className="text-base">
                {position}
              </Badge>
            ))}
            <span> to build </span>
            <span>{projectDescription}</span>
          </CardTitle>
        </CardHeader>
        <CardFooter className="justify-end">
          <Button variant={"link"}>Join team &rarr;</Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
