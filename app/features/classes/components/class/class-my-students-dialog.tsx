import { Users, Gift, LucideMessageSquareText, Send } from "lucide-react";
import { Form, useFetcher } from "react-router";
import { Button } from "~/common/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/common/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/common/components/ui/tabs";
import { Checkbox } from "~/common/components/ui/checkbox";
import { Input } from "~/common/components/ui/input";
import { useEffect, useRef, useState } from "react";

interface ClassMyStudentsProps {
  students: {
    enrolled_at: string;
    profiles: {
      profile_id: string;
      username: string;
    };
  }[];
  classId: string;
}

export default function ClassMyStudentsDialog({
  students,
  classId,
}: ClassMyStudentsProps) {
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const fetcher = useFetcher();
  const toggleStudentSelection = (profileId: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(profileId)
        ? prev.filter((id) => id !== profileId)
        : [...prev, profileId]
    );
  };
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.ok) {
      setSelectedStudentIds([]);
      if (messageInputRef.current) {
        messageInputRef.current.value = "";
      }
    }
  }, [fetcher.state, fetcher.data]);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Users className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-4xl">
        <DialogHeader>
          <DialogTitle>Students</DialogTitle>
          <DialogDescription>List of students</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="gift">
              {" "}
              <Gift className="size-4" /> 선물 보내기
            </TabsTrigger>
            <TabsTrigger value="message">
              {" "}
              <LucideMessageSquareText className="size-4" />
              쪽지 보내기
            </TabsTrigger>
          </TabsList>
          <TabsContent value="gift">
            <span>선물</span>
          </TabsContent>
          <TabsContent value="message">
            <div className="flex gap-2 items-center">
              <fetcher.Form
                method="post"
                action={`/classes/${classId}/send-message`}
              >
                <input
                  type="hidden"
                  name="studentIds"
                  value={selectedStudentIds.join(",")}
                />
                <div className="flex gap-2 items-center">
                  <Input type="text" name="message" ref={messageInputRef} />
                  <Button variant="outline">
                    <Send className="size-4" /> 전송하기
                  </Button>
                </div>
              </fetcher.Form>
            </div>
            <div className="flex flex-col gap-2">
              {students.map((student) => (
                <div
                  key={student.profiles.profile_id}
                  className="shadow-md rounded-md p-2 flex items-center"
                >
                  <Checkbox
                    className="mr-2"
                    checked={selectedStudentIds.includes(
                      student.profiles.profile_id
                    )}
                    onCheckedChange={() =>
                      toggleStudentSelection(student.profiles.profile_id)
                    }
                  />

                  <span className="text-lg">{student.profiles.username}</span>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
