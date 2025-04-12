import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/common/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/common/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/common/components/ui/dialog";
import { Label } from "~/common/components/ui/label";
import { Input } from "~/common/components/ui/input";
import { Calendar } from "~/common/components/ui/calendar";
import { Button } from "~/common/components/ui/button";
import { Form, useNavigation } from "react-router";
import { useState } from "react";
import { DIFFICULTY_TYPES } from "../../constants";
import { LoaderCircle } from "lucide-react";

export default function CreateClassDialog() {
  const navigation = useNavigation();
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [difficulty, setDifficulty] = useState<
    "beginner" | "intermediate" | "advanced" | ""
  >("");
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const handlePosterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPosterPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const isSubmitting =
    navigation.state === "submitting" || navigation.state === "loading";
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Make Class</Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-4xl">
        <DialogHeader>
          <DialogTitle>Make Class</DialogTitle>
          <DialogDescription>Write information of your class</DialogDescription>
        </DialogHeader>
        <Form method="post" encType="multipart/form-data">
          <div className="flex flex-col gap-3">
            <div>
              <Label htmlFor="title" className="text-right mb-2">
                Title
              </Label>
              <Input id="title" className="col-span-3" name="title" />
            </div>
            <div>
              <Label htmlFor="description" className="text-right mb-2">
                Description
              </Label>
              <Input
                id="description"
                className="col-span-3"
                name="description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_at" className="text-right mb-2">
                  Start Date
                </Label>
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
                <input
                  id="start_at"
                  type="hidden"
                  name="start_at"
                  value={startDate ? startDate.toISOString() : ""}
                />
              </div>
              <div>
                <Label htmlFor="end_at" className="text-right mb-2">
                  End Date
                </Label>
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
                <input
                  id="end_at"
                  type="hidden"
                  name="end_at"
                  value={endDate ? endDate.toISOString() : ""}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="field" className="text-right mb-2">
                  Field
                </Label>
                <Input id="field" className="col-span-3" name="field" />
              </div>
              <div>
                <Label htmlFor="difficulty" className="text-right mb-2">
                  Difficulty
                </Label>
                <Select
                  value={difficulty}
                  onValueChange={(value) =>
                    setDifficulty(
                      value as "beginner" | "intermediate" | "advanced"
                    )
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {DIFFICULTY_TYPES.map((diff) => (
                        <SelectItem value={diff.value} key={diff.value}>
                          {diff.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <input
                  type="hidden"
                  name="difficulty_type"
                  value={difficulty}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="hashtags" className="text-right mb-2">
                Hashtags
              </Label>
              <Input id="hashtags" className="col-span-3" name="hashtags" />
            </div>
            <div>
              <Label htmlFor="poster" className="text-right mb-2">
                poster
              </Label>
              <div className="flex gap-5">
                <Input
                  id="poster"
                  className="w-1/2"
                  name="poster"
                  type="file"
                  accept="image/*"
                  onChange={handlePosterChange}
                />
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button type="button">Preview</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      {posterPreview && (
                        <img
                          src={posterPreview}
                          alt="Poster Preview"
                          className="w-50 h-50 object-cover rounded-lg border"
                        />
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          <Button className="w-full mt-5" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <LoaderCircle className="animate-spin w-5 h-5" />
            ) : (
              "Make Class"
            )}
          </Button>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
