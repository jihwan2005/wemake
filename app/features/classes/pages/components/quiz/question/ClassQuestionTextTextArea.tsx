import React from "react";

type ClassQuestionTextTextAreaProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

const ClassQuestionTextTextArea = ({
  value,
  onChange,
}: ClassQuestionTextTextAreaProps) => {
  return (
    <div className="mt-10 flex flex-col gap-3">
      <span className="font-semibold">문제 작성</span>
      <textarea
        name="questionText"
        value={value}
        onChange={onChange}
        className="p-2 border rounded min-h-[100px]"
      />
    </div>
  );
};

export default ClassQuestionTextTextArea;
