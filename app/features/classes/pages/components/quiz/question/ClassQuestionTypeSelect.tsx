// ClassQuestionTypeSelect.tsx
import React from "react";

type ClassQuestionTypeSelectProps = {
  value: "multiple_choice" | "short_answer" | "long_answer";
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

const ClassQuestionTypeSelect = ({
  value,
  onChange,
}: ClassQuestionTypeSelectProps) => {
  return (
    <div className="mt-10 flex flex-col gap-3 w-1/7">
      <label htmlFor="questionType" className="font-semibold">
        문제 유형
      </label>
      <select
        id="questionType"
        name="questionType"
        className="p-2 border rounded h-10"
        value={value}
        onChange={onChange}
      >
        <option value="multiple_choice">객관식</option>
        <option value="short_answer">단답형</option>
        <option value="long_answer">서술형</option>
      </select>
    </div>
  );
};

export default ClassQuestionTypeSelect;
