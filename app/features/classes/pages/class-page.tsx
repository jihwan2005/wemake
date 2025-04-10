import type { Route } from "./+types/class-page";
import { makeSSRClient } from "~/supa-client";
import { getClassById, getClassCourse, getUserEmail } from "../queries";
import {
  GraduationCap,
  List,
  Mail,
  Upload,
  Trash,
  Pencil,
  LoaderCircle,
} from "lucide-react";
import { Hero } from "~/common/components/hero";
import { Button } from "~/common/components/ui/button";
import { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/common/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/common/components/ui/hover-card";
import { Form, Link, redirect, useNavigation } from "react-router";
import { getLoggedInUserId } from "~/features/users/queries";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/common/components/ui/dialog";
import { deleteClass, updateClass } from "../mutations";
import { Label } from "~/common/components/ui/label";
import { Input } from "~/common/components/ui/input";
import { Calendar } from "~/common/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/common/components/ui/select";
import { DIFFICULTY_TYPES } from "../constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/common/components/ui/dropdown-menu";
import { updateClassHashtags } from "~/features/community/mutations";

function parseHashtags(input: string): string[] {
  return input
    .split(/[\s,]+/)
    .map((tag) => tag.replace(/^#/, "").trim())
    .filter((tag) => tag.length > 0);
}
export const action = async ({ request, params }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const classId = params.classId;
  const formData = await request.formData();
  const actionType = formData.get("delete");
  if (String(actionType) === "delete") {
    try {
      const { data: classData } = await client
        .from("class_posts")
        .select("class_poster")
        .eq("class_post_id", Number(classId))
        .single();
      await deleteClass(client, {
        classId,
        posterUrl: classData!.class_poster as string,
      });
      return redirect("/classes");
    } catch (error) {
      return { formErrors: { delete: ["Failed to delete video"] } };
    }
  } else {
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
    let newPosterUrl = null;
    const { data: posterData, error: posterError } = await client
      .from("class_posts")
      .select("class_poster")
      .eq("class_post_id", Number(classId))
      .single();
    const oldPosterUrl = posterData?.class_poster;
    if (poster && poster instanceof File && poster.size > 0) {
      if (oldPosterUrl) {
        const fileName = oldPosterUrl.split("/").pop();
        await client.storage.from("poster").remove([`${userId}/${fileName}`]);
      }
    }
    const filePath = `${userId}/${Date.now()}`;
    const { error: uploadError } = await client.storage
      .from("poster")
      .upload(filePath, poster, { contentType: poster.type });

    if (uploadError) {
      return { formErrors: { thumbnail: ["Failed to upload poster"] } };
    }
    const { data: urlData } = await client.storage
      .from("poster")
      .getPublicUrl(filePath);
    newPosterUrl = urlData.publicUrl;
    await updateClassHashtags(client, Number(classId), hashtags);
    await updateClass(client, {
      title,
      description,
      poster: newPosterUrl,
      classId,
      field,
      difficulty_type,
      start_at,
      end_at,
    });
    return redirect("/classes");
  }
};

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const cls = await getClassById(client, { classId: params.classId });
  const clsCourse = await getClassCourse(client, { classId: params.classId });
  const email = await getUserEmail({ userId: cls.author_id });
  return { cls, clsCourse, email, userId };
};

export default function ClassPage({ loaderData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const [openChapters, setOpenChapters] = useState<Record<string, boolean>>({});
  const [isOpen, setIsOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date(loaderData.cls.start_at)
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    new Date(loaderData.cls.end_at)
  );
  const [difficulty, setDifficulty] = useState<
    "beginner" | "intermediate" | "advanced" | ""
  >(loaderData.cls.difficulty_type);
  const [posterPreview, setPosterPreview] = useState<string | null>(
    loaderData.cls.class_poster
  );
  const isSubmitting =
    navigation.state === "submitting" || navigation.state === "loading";
  const toggleChapter = (chapterId: string) => {
    setOpenChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };
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
        title={loaderData.cls.title}
        subtitle={`Welcome to my ${loaderData.cls.title} class`}
      />
      <div className="flex mb-5 items-center gap-2">
        <Avatar className="size-14">
          <AvatarFallback>{loaderData.cls.author_username[0]}</AvatarFallback>
          {loaderData.cls.author_avatar && (
            <AvatarImage src={loaderData.cls.author_avatar} />
          )}
        </Avatar>
        <div className="flex flex-col">
          <div className="flex gap-2 items-center">
            <GraduationCap className="size-5" />
            <Link to={`/users/${loaderData.cls.author_username}`}>
              <span>{loaderData.cls.author_username}</span>
            </Link>
          </div>
          <div className="flex gap-2 items-center">
            <Mail className="size-4" />
            <HoverCard>
              <HoverCardTrigger asChild>
                <span className="underline cursor-pointer">
                  {loaderData.email}
                </span>
              </HoverCardTrigger>
              <HoverCardContent>
                <span>
                  If you have any questions, feel free to reach out via email.
                </span>
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-1/7">
        {loaderData.cls.author_id == loaderData.userId ? (
          <div className="flex gap-3">
            <Button>
              <Upload className="size-4" />
              Lesson
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Pencil className="size-4" />
                  lesson
                </Button>
              </DialogTrigger>
              <DialogContent className="w-full max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Update Class</DialogTitle>
                  <DialogDescription>
                    Update information of your class
                  </DialogDescription>
                </DialogHeader>
                <Form method="post" encType="multipart/form-data">
                  <div className="flex flex-col gap-3">
                    <div>
                      <Label htmlFor="title" className="text-right mb-2">
                        Title
                      </Label>
                      <Input
                        id="title"
                        className="col-span-3"
                        name="title"
                        defaultValue={loaderData.cls.title}
                      />
                    </div>
                    <div>
                      <Label htmlFor="description" className="text-right mb-2">
                        Description
                      </Label>
                      <Input
                        id="description"
                        className="col-span-3"
                        name="description"
                        defaultValue={loaderData.cls.description}
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
                        <Input
                          id="field"
                          className="col-span-3"
                          name="field"
                          defaultValue={loaderData.cls.field}
                        />
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
                      <Input
                        id="hashtags"
                        className="col-span-3"
                        name="hashtags"
                        defaultValue={loaderData.cls.hashtags}
                      />
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
                  <Button
                    className="w-full mt-5"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <LoaderCircle className="animate-spin w-5 h-5" />
                    ) : (
                      "Update Class"
                    )}
                  </Button>
                </Form>
              </DialogContent>
            </Dialog>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Trash className="size-4" />
                  lesson
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>영상 삭제하기</DialogTitle>
                <DialogDescription>
                  영상을 정말 삭제하시겠습니까?
                </DialogDescription>
                <DialogFooter>
                  <Button type="button" onClick={() => setIsDialogOpen(false)}>
                    취소하기
                  </Button>
                  <Form method="post">
                    <Button
                      id="delete"
                      className="bg-primary"
                      type="submit"
                      name="delete"
                      value="delete"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <LoaderCircle className="animate-spin" />
                      ) : (
                        "영상 삭제"
                      )}
                    </Button>
                  </Form>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        ) : null}
        <Button variant="outline" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "모두 숨기기" : <List className="size-4" />}
        </Button>
      </div>

      {isOpen && (
        <div>
          {loaderData.clsCourse.map((course) => (
            <div key={course.chapter_id} className="space-y-4 w-1/2">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{course.title}</h2>
                <button
                  onClick={() => toggleChapter(course.chapter_id)}
                  className="text-sm text-blue-500 underline"
                >
                  {openChapters[course.chapter_id] ? (
                    "숨기기"
                  ) : (
                    <List className="size-6" />
                  )}
                </button>
              </div>

              {openChapters[course.chapter_id] && (
                <ul className="pl-4 space-y-2">
                  {course.class_chapter_lesson.map((lesson) => (
                    <li
                      key={lesson.lesson_id}
                      className="border p-2 rounded-md"
                    >
                      <div className="font-medium">{lesson.title}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
