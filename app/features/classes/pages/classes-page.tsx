import {
  createClass,
  createHashtagIfNotExists,
  createShowcaseImage,
  linkHashtagToClass,
} from "../mutations";
import { data } from "react-router";
import { makeSSRClient } from "~/supa-client";
import { getLoggedInUserId } from "~/features/users/queries";
import type { Route } from "./+types/classes-page";
import { Hero } from "~/common/components/hero";
import { getClasses, getKeywordRanking } from "../queries";
import { Link } from "react-router";
import { z } from "zod";
import CreateClassDialog from "../components/class/create-class-dialog";
import KeyWordSearch from "../components/keyword/keword-search";
import { Button } from "~/common/components/ui/button";
import { Folder } from "lucide-react";
import { useState } from "react";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";
import ClassCard from "../components/class/class-card";

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
  const subtitle = formData.get("subtitle") as string;
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
    subtitle,
  });

  for (const tag of hashtags) {
    const hashtag = await createHashtagIfNotExists(client, tag);
    await linkHashtagToClass(client, class_post_id, hashtag.hashtag_id);
  }

  const showcaseImages = formData.getAll("showcase_images") as File[];

  const uploadResults = await Promise.all(
    showcaseImages.map(async (showcaseImage, index) => {
      const uniqueId = `${Date.now()}-${index}-${Math.random()
        .toString(36)
        .slice(2)}`;
      const showcaseFilePath = `${userId}/${uniqueId}`;

      const { error } = await client.storage
        .from("showcase")
        .upload(showcaseFilePath, showcaseImage);

      if (error) throw error;

      const {
        data: { publicUrl },
      } = client.storage.from("showcase").getPublicUrl(showcaseFilePath);

      return publicUrl;
    })
  );

  await Promise.all(
    uploadResults.map((showcaseUrl) =>
      createShowcaseImage(client, { classId: class_post_id, showcaseUrl })
    )
  );

  return { ok: true };
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
  const { client } = makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
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
  const classes = await getClasses(client, {
    keyword: parsedData.keyword,
    sorting: parsedData.sorting,
    order: parsedData.order,
    excludeUserId: userId,
  });
  const keyword = await getKeywordRanking(client);
  return { classes, keyword };
};

export default function ClassesPage({ loaderData }: Route.ComponentProps) {
  type ClassType = (typeof loaderData.classes)[number];
  const [selected, setSelected] = useState<ClassType | null>(null);
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
            <div className="relative">
              <Link to={`/classes/${cls.class_post_id}/lobby`}>
                <motion.img
                  src={cls.class_poster}
                  className="w-full h-[250px] rounded-md object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>

              <motion.div
                className="flex flex-col justify-center w-8/9 h-[100px] bg-white rounded-2xl absolute bottom-[-50px] left-1/2 -translate-x-1/2 shadow-md"
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
                onClick={() => {
                  setSelected(cls);
                }}
                layoutId={cls.class_post_id + ""}
              >
                <span className="text-4xl mt-3 text-center">{cls.title}</span>
                <span className="text-2xl mb-2 text-center">
                  {cls.subtitle}
                </span>
              </motion.div>
            </div>
          ))}
        </div>
        <AnimatePresence>
          {selected && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
            >
              <motion.div
                layoutId={selected.class_post_id + ""}
                className="w-[30%] h-[50%] bg-white rounded-xl shadow-xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <ClassCard
                  id={selected.class_post_id}
                  poster={selected.class_poster}
                  createdAt={selected.created_at}
                  description={selected.description}
                  title={selected.title}
                  subtitle={selected.subtitle}
                  authorAvatarUrl={selected.author_avatar}
                  authorUsername={selected.author_username}
                  startAt={selected.start_at}
                  endAt={selected.end_at}
                  field={selected.field}
                  difficultyType={selected.difficulty_type}
                  hashtags={selected.hashtags}
                  upvotes={selected.upvotes}
                  learners={selected.learners}
                  reviews={selected.reviews}
                  showcaseImages={selected.showcase_images}
                  onClose={() => setSelected(null)}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
