import { Link } from "react-router";
import ClassCard from "../../components/class/class-card";

type MyEnrollingClassProps = {
  classes: {
    class_post_id: number;
    title: string;
    description: string;
    class_poster: string;
    created_at: string;
    author_avatar: string;
    author_username: string;
    start_at: string;
    end_at: string;
    field: string;
    difficulty_type: string;
    hashtags: string[] | null;
    upvotes: number;
    learners: number;
    reviews: number;
  }[];
};

export default function MyEnrollingClass({ classes }: MyEnrollingClassProps) {
  return (
    <div className="grid grid-cols-4 gap-5 mt-5">
      {classes.map((cls) => (
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
  );
}
