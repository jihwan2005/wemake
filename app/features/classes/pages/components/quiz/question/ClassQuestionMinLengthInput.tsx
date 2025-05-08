import React from "react";

type ClassQuestionMinLengthInputProps = {
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const ClassQuestionMinLengthInput = ({
  value,
  onChange,
}: ClassQuestionMinLengthInputProps) => {
  return (
    <div className="mt-10 flex flex-col gap-3">
      <span className="font-semibold">최소 글자 수</span>
      <input
        className="w-1/8 h-10 p-2 border rounded"
        name="questionMinLength"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default ClassQuestionMinLengthInput;
