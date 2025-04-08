import { Hero } from "~/common/components/hero";
import type { Route } from "./+types/classes-page";
import { makeSSRClient } from "~/supa-client";
import { getClasses } from "../queries";
import ClassCard from "../components/class-card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/common/components/ui/dialog";
import { Button } from "~/common/components/ui/button";
import { Form, useNavigation } from "react-router";
import { Input } from "~/common/components/ui/input";
import { Label } from "~/common/components/ui/label";
import { LoaderCircle } from "lucide-react";
import { Calendar } from "~/common/components/ui/calendar";
import { useState } from "react";
import { DIFFICULTY_TYPES } from "../constants";
import { getLoggedInUserId } from "~/features/users/queries";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/common/components/ui/select";
import { createClass } from "~/features/community/mutations";

function parseHashtags(input: string): string[] {
  return input
    .split(/[\s,]+/)
    .map((tag) => tag.replace(/^#/, "").trim())
    .filter((tag) => tag.length > 0);
}

export const action = async ({ request }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const field = formData.get("field") as string;
  const difficulty_type = formData.get("difficulty_type") as
    | "beginner"
    | "intermediate"
    | "advanced";
  const start_at = formData.get("start_at") as string;
  const end_at = formData.get("end_at") as string;
  const rawHashtags = formData.get("hashtags") as string;
  const hashtags = parseHashtags(rawHashtags);
  const poster = formData.get("poster") as File;
  const filePath = `${userId}/${Date.now()}`;

  const { data, error } = await client.storage
    .from("poster")
    .upload(filePath, poster, {
      contentType: poster.type,
    });
  if (error) {
    return { ok: false, error: "Fail to upload poster" };
  }
  const {
    data: { publicUrl },
  } = client.storage.from("poster").getPublicUrl(filePath);
  await createClass(client, {
    title,
    description,
    poster: publicUrl,
    userId,
    field,
    difficulty_type,
    start_at,
    end_at,
  });
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const { client } = makeSSRClient(request);
  const classes = await getClasses(client);
  return { classes };
};

export default function ClassesPage({ loaderData }: Route.ComponentProps) {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [difficulty, setDifficulty] = useState<
    "beginner" | "intermediate" | "advanced" | ""
  >("");
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const navigation = useNavigation();
  const isSubmitting =
    navigation.state === "submitting" || navigation.state === "loading";
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
  return (
    <div className="space-y-20">
      <Hero
        title="Class"
        subtitle="Make a class and show your talent to the world"
      />
      <Dialog>
        <DialogTrigger asChild>
          <Button>Make Class</Button>
        </DialogTrigger>
        <DialogContent className="w-full max-w-4xl">
          <DialogHeader>
            <DialogTitle>Make Class</DialogTitle>
            <DialogDescription>
              Write information of your class
            </DialogDescription>
          </DialogHeader>
          <Form method="post">
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
                <Input
                  id="poster"
                  className="col-span-3"
                  name="poster"
                  type="file"
                  accept="image/*"
                  onChange={handlePosterChange}
                />
              </div>
              {posterPreview && (
                <div className="mt-4 flex justify-center">
                  <img
                    src={posterPreview}
                    alt="Poster Preview"
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>
            <Button
              className="w-full mt-5"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <LoaderCircle className="animate-spin w-5 h-5" />
              ) : (
                "Submit Vote"
              )}
            </Button>
          </Form>
        </DialogContent>
      </Dialog>
      <div>
        <div className="grid grid-cols-4">
          {loaderData.classes.map((cls) => (
            <ClassCard
              key={cls.class_post_id}
              id={cls.class_post_id}
              title={cls.title}
              description={cls.description}
              poster={cls.class_poster}
              createdAt={cls.created_at}
              authorAvatarUrl={cls.author_avatar}
              authorUsername={cls.author_username}
              startAt={cls.start_at}
              endAt={cls.end_at}
              field={cls.field}
              difficultyType={cls.difficulty_type}
              hashtags={cls.hashtags}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
