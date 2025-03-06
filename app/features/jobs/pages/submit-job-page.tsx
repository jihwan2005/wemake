import type { Route } from "./+types/submit-job-page";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Job | WeMake" },
    { name: "description", content: "Find the best job" },
  ];
};

export default function SubmitJobPage({}: Route.ComponentProps) {
  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold">Submit a Job</h1>
    </div>
  );
}
