import {
  createClass,
  createHashtagIfNotExists,
  linkHashtagToClass,
} from "../mutations";
import { data } from "react-router";
import { makeSSRClient } from "~/supa-client";
import { getLoggedInUserId } from "~/features/users/queries";
import type { Route } from "./+types/classes-page";
import { Hero } from "~/common/components/hero";
import { getClasses, getKeywordRanking } from "../queries";
import ClassCard from "../components/class/class-card";
import { Link } from "react-router";
import { z } from "zod";
import CreateClassDialog from "../components/class/create-class-dialog";
import SortKeywordDropdownMenu from "../components/keyword/sort-keyword-dropdownmenu";
import KeyWordSearch from "../components/keyword/keword-search";
import OrderClassDropdownMenu from "../components/class/order-class-dropdownmenu";
import UrlResetButton from "../components/etc/url-reset-button";
import { Button } from "~/common/components/ui/button";
import { Folder } from "lucide-react";

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
  const { class_post_id } = await createClass(client, {
    title,
    description,
    poster: publicUrl,
    userId,
    field,
    difficulty_type,
    start_at,
    end_at,
  });
  for (const tag of hashtags) {
    const hashtag = await createHashtagIfNotExists(client, tag); //
    await linkHashtagToClass(client, class_post_id, hashtag.hashtag_id);
  }
};

const searchParamsSchema = z.object({
  keyword: z.string().optional(),
  sorting: z
    .enum(["title", "description", "teacher", "hashtag"])
    .optional()
    .default("title"),
  order: z
    .enum(["upvotes", "learners", "reviews"])
    .optional()
    .default("upvotes"),
});

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const { success, data: parsedData } = searchParamsSchema.safeParse(
    Object.fromEntries(url.searchParams)
  );
  if (!success) {
    throw data(
      {
        error_code: "invalid_search_params",
        message: "Invalid search params",
      },
      { status: 400 }
    );
  }
  const { client } = makeSSRClient(request);
  const classes = await getClasses(client, {
    keyword: parsedData.keyword,
    sorting: parsedData.sorting,
    order: parsedData.order,
  });
  const keyword = await getKeywordRanking(client);
  return { classes, keyword };
};

export default function ClassesPage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="space-y-20">
      <Hero
        title="Class"
        subtitle="Make a class and show your talent to the world"
      />
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-3 w-full justify-center">
          <div className="w-full max-w-2xl">
            <KeyWordSearch keyword={loaderData.keyword} />
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <CreateClassDialog />
        <Link to="/classes/my">
          <Button>
            <Folder className="size-4" />
            My Class
          </Button>
        </Link>
      </div>
      <div>
        <div className="grid grid-cols-4 gap-5">
          {loaderData.classes.map((cls) => (
            <Link key={cls.class_post_id} to={`/classes/${cls.class_post_id}`}>
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
                hashtags={cls.hashtags ?? []}
                upvotes={cls.upvotes}
                learners={cls.learners}
                reviews={cls.reviews}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
