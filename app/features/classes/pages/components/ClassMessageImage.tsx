import React from "react";

interface MessageImage {
  message_image_id: number | null;
  image_url: string | null;
  created_at: string | null;
  class_message_id: number | null;
  class_message_room_id: number | null;
}

interface ClassMessageImageProps {
  images: MessageImage[];
  isCurrentUser: boolean;
}

const ClassMessageImage: React.FC<ClassMessageImageProps> = ({
  images,
  isCurrentUser,
}) => {
  if (!images || images.length === 0) return null;

  return (
    <div
      className={`pl-14 pr-4 mt-2 ${
        isCurrentUser ? "items-end" : "items-start"
      } flex flex-col gap-2`}
    >
      {images.map((img) =>
        img.image_url ? (
          <img
            key={img.message_image_id}
            src={img.image_url}
            alt="첨부 이미지"
            className="rounded-lg max-w-xs shadow-md"
          />
        ) : null
      )}
    </div>
  );
};

export default ClassMessageImage;
