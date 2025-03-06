import { Badge } from "~/common/components/ui/badge";
import { DotIcon } from "lucide-react";
import type { Route } from "./+types/job-page";
import { Button } from "~/common/components/ui/button";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Job | WeMake" },
    { name: "description", content: "Find the best job" },
  ];
};

export default function JobPage() {
  return (
    <div>
      <div className="bg-gradient-to-tr from-primary/80 to-primary/10 h-60 w-full rounded-lg"></div>
      <div className="grid grid-cols-6 gap-20 items-start -mt-20">
        <div className="col-span-4 space-y-10">
          <div className="flex flex-col gap-2.5">
            <div className="size-40 bg-white rounded-full overflow-hidden border-white relative left-10">
              <img
                src="https://github.com/facebook.png"
                className="object-cover"
              />
            </div>
            <h1 className="text-4xl font-bold">Software Engineer</h1>
            <h4 className="text-lg text-muted-foreground">Meta Inc</h4>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary">Full-time</Badge>
            <Badge variant="secondary">Remote</Badge>
          </div>
          <div className="space-y-2.5">
            <h4 className="text-2xl font-bold">Overview</h4>
            <p className="text-lg">
              This is a full-time remote job. We are looking for a software
              engineer with 3+ years of experience.
            </p>
          </div>
          <div className="space-y-2.5">
            <h4 className="text-2xl font-bold">Responsibilities</h4>
            <ul className="text-lg list-disc list-inside">
              {["Design", "Develop", "Deploy", "Maintain"].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-2.5">
            <h4 className="text-2xl font-bold">Qualifications</h4>
            <ul className="text-lg list-disc list-inside">
              {[
                "Bachelor's degree in Computer Science or related field",
                "3+ years of experience in software development",
                "Strong understanding of software development principles",
              ].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-2.5">
            <h4 className="text-2xl font-bold">Benefits</h4>
            <ul className="text-lg list-disc list-inside">
              {["Healthcare", "Dental", "Vision", "401k"].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-2.5">
            <h4 className="text-2xl font-bold">Skills</h4>
            <ul className="text-lg list-disc list-inside">
              {["React  ", "Node.js", "Express", "MongoDB"].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-span-2 space-y-5 sticky top-20 border rounded-lg mt-32 p-6">
          <div className="flex flex-col">
            <span className="text-2xl font-medium">$100,000 - $120,000</span>
            <span className="text-sm font-medium">Avg. Salary</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-medium">Remote</span>
            <span className="text-sm font-medium">Location</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-medium">Full-time</span>
            <span className="text-sm font-medium">Type</span>
          </div>
          <div className="flex">
            <span className="text-sm font-medium">Posted 1 day ago</span>
            <DotIcon className="size-4" />
            <span className="text-sm text-muted-foreground">100 views</span>
          </div>
          <Button>Apply</Button>
        </div>
      </div>
    </div>
  );
}
