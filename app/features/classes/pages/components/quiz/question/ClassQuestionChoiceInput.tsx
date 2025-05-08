import React from "react";
import { Button } from "~/common/components/ui/button";
import { Plus } from "lucide-react";

type Option = {
  choice_text: string;
  is_correct: boolean;
};

type ClassQuestionChoiceInputProps = {
  options: Option[];
  onTextChange: (
    optIdx: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  onCorrectChange: (
    optIdx: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  onAddChoice: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const ClassQuestionChoiceInput = ({
  options,
  onTextChange,
  onCorrectChange,
  onAddChoice,
}: ClassQuestionChoiceInputProps) => {
  return (
    <div className="mt-10 flex flex-col gap-3">
      <span className="font-semibold">선지 작성</span>
      {options.map((option, optIdx) => (
        <div key={optIdx} className="flex items-center gap-2">
          <input
            value={option.choice_text}
            name={`questionChoices[${optIdx}].choice_text`}
            onChange={(e) => onTextChange(optIdx, e)}
            className="w-7/8 p-2 border "
          />
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={option.is_correct}
              name={`questionChoices[${optIdx}].is_correct`}
              onChange={(e) => onCorrectChange(optIdx, e)}
            />
            <span className="ml-2">정답</span>
          </label>
        </div>
      ))}
      <Button
        className="rounded-full w-fit self-center"
        variant="ghost"
        onClick={onAddChoice}
      >
        <Plus className="size-5" />
      </Button>
    </div>
  );
};

export default ClassQuestionChoiceInput;
