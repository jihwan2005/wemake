import React from "react";

type ClassQuestionPositionInputProps = {
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const ClassQuestionPositionInput = ({
  value,
  onChange,
}: ClassQuestionPositionInputProps) => {
  return (
    <div className="mt-10 flex flex-col gap-3">
      <span className="font-semibold">번호</span>
      <input
        name="questionPosition"
        value={value}
        onChange={onChange}
        className="w-1/2 border border-gray-300 rounded px-2 py-1"
      />
    </div>
  );
};

export default ClassQuestionPositionInput;
