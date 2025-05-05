// components/ClassMessageBubbleContent.tsx
import React from "react";

interface ClassMessageBubbleContentProps {
  content: string;
  isEdited: boolean;
  isDelete: boolean;
  searchText?: string;
}

export const ClassMessageBubbleContent: React.FC<
  ClassMessageBubbleContentProps
> = ({ content, isEdited, isDelete, searchText = "" }) => {
  if (isDelete) return <p>(삭제된 메시지)</p>;

  return (
    <p>
      {isEdited && <span>(수정됨)</span>}{" "}
      {searchText
        ? content.split(new RegExp(`(${searchText})`, "gi")).map((part, i) =>
            part.toLowerCase() === searchText.toLowerCase() ? (
              <span key={i} className="font-bold text-lg text-yellow-400">
                {part}
              </span>
            ) : (
              <span key={i}>{part}</span>
            )
          )
        : content}
    </p>
  );
};
