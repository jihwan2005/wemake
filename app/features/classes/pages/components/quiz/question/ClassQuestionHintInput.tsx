import React from "react";

type ClassQuestionHintInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const ClassQuestionHintInput = ({
  value,
  onChange,
}: ClassQuestionHintInputProps) => {
  return (
    <div className="mt-10 flex flex-col gap-3">
      <span className="font-semibold">힌트 작성(선택)</span>
      <input
        name="questionHint"
        value={value}
        onChange={onChange}
        className="p-2 border rounded"
      />
    </div>
  );
};

export default ClassQuestionHintInput;
