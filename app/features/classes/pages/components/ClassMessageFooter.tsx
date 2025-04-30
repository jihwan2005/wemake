import { SendIcon } from "lucide-react";
import { Form } from "react-router";
import { Button } from "~/common/components/ui/button";
import { Card, CardHeader } from "~/common/components/ui/card";
import { Textarea } from "~/common/components/ui/textarea";

interface ClassMessageFooterProps {
  newMessage: string;
  setNewMessage: (value: string) => void;
  handleTypingChange: () => void;
  onlineUsers: number;
}

const ClassMessageFooter: React.FC<ClassMessageFooterProps> = ({
  newMessage,
  setNewMessage,
  handleTypingChange,
  onlineUsers,
}) => {
  return (
    <Card>
      <CardHeader>
        <Form className="relative flex justify-end items-center" method="post">
          <Textarea
            placeholder="Write a message..."
            rows={2}
            className="resize-none"
            name="message"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTypingChange();
            }}
          />
          <input
            type="hidden"
            name="is_read"
            value={onlineUsers > 1 ? "true" : "false"}
          />
          <Button type="submit" size="icon" className="absolute right-2">
            <SendIcon className="size-4" />
          </Button>
        </Form>
      </CardHeader>
    </Card>
  );
};

export default ClassMessageFooter;
