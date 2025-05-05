import { Link } from "react-router";

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
    progress: number;
  }[];
};

export default function MyEnrollingClass({ classes }: MyEnrollingClassProps) {
  return (
    <div className="grid grid-cols-4 gap-5 mt-5">
      {classes.map((cls) => (
        <Link key={cls.class_post_id} to={`/classes/${cls.class_post_id}`}>
          <div className="relative">
            <img src={cls.class_poster} className="w-full h-[250px]" />
            <div className="flex justify-center w-8/9 h-[100px] bg-white rounded-2xl absolute bottom-[-50px] left-1/2 -translate-x-1/2 shadow-md">
              <div className="flex flex-col w-5/6">
                <span className="text-2xl mt-3 text-center">{cls.title}</span>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-green-400 h-2 rounded-full"
                    style={{ width: `${cls.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
