import React from "react";

type ClassQuestionPointInputProps = {
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const ClassQuestionPointInput = ({
  value,
  onChange,
}: ClassQuestionPointInputProps) => {
  return (
    <div className="mt-10 flex flex-col gap-3">
      <span className="font-semibold">배점</span>
      <input
        className="w-1/2 h-10 p-2 border rounded"
        name="questionPoint"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default ClassQuestionPointInput;
