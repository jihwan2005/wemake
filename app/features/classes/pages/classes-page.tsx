import { Hero } from "~/common/components/hero";
import type { Route } from "./+types/classes-page";
import { makeSSRClient } from "~/supa-client";
import { getClasses } from "../queries";
import ClassCard from "../components/class-card";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const { client } = makeSSRClient(request);
  const classes = await getClasses(client);
  return { classes };
};

export default function ClassesPage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="space-y-20">
      <Hero
        title="Class"
        subtitle="Make a class and show your talent to the world"
      />
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
