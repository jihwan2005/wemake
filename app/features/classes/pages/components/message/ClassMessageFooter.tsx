import { SendIcon, ImageIcon, XIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Form } from "react-router";

import { Button } from "~/common/components/ui/button";
import { Card, CardHeader } from "~/common/components/ui/card";
import { Textarea } from "~/common/components/ui/textarea";

interface ClassMessageFooterProps {
  newMessage: string;
  setNewMessage: (value: string) => void;
  handleTypingChange: () => void;
  onlineUsers: number;
  roomId: string;
}

const ClassMessageFooter: React.FC<ClassMessageFooterProps> = ({
  newMessage,
  setNewMessage,
  handleTypingChange,
  onlineUsers,
  roomId,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles);
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

      setFiles((prev) => [...prev, ...newFiles]);
      setPreviewUrls((prev) => [...prev, ...newPreviews]);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData(); // 수동 생성

    files.forEach((file) => {
      formData.append("images", file); // "image[]" 대신 "images"
    });

    formData.append("message", newMessage);
    formData.append("is_read", onlineUsers > 1 ? "true" : "false");

    try {
      const res = await fetch(`/classes/messages/${roomId}`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to send message");

      // ✅ 성공 시 상태 초기화
      setFiles([]);
      setPreviewUrls([]);
      setNewMessage("");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <form
          className="relative flex flex-col justify-end items-center"
          method="post"
          encType="multipart/form-data"
          onSubmit={handleSubmit}
        >
          <div className="w-full justify-start mb-3">
            <Button type="button" onClick={handleImageClick}>
              <ImageIcon className="size-4" />
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              name="image[]"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative w-35 h-35">
                  <img
                    src={url}
                    alt={`preview-${index}`}
                    className="w-full h-full object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 w-full">
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
          </div>
        </form>
      </CardHeader>
    </Card>
  );
};

export default ClassMessageFooter;
