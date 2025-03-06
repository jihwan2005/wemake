import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import type { InputHTMLAttributes } from "react";

export default function InputPair({
  label,
  description,
  textArea = false,
  ...rest
}: {
  label: string;
  description: string;
  textArea?: boolean;
} & InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>) {
  return (
    <div className="space-y-2 flex flex-col max-w-screen-sm mx-auto">
      <Label className="flex flex-col" htmlFor={rest.id}>
        {label}
        <small className="text-muted-foreground">{description}</small>
      </Label>
      {textArea ? <Textarea rows={10} {...rest} /> : <Input {...rest} />}
    </div>
  );
}
