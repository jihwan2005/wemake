import { Hero } from "~/common/components/hero";
import type { Route } from "./+types/jobs-page";
import { JobCard } from "../components/job-card";
import { Button } from "~/common/components/ui/button";
import { JOB_TYPES, LOCATION_TYPES, SALARY_TYPES } from "../constants";
import { Link, useSearchParams } from "react-router";
import { cn } from "~/lib/utils";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Jobs | WeMake" },
    { name: "description", content: "Find the best jobs" },
  ];
};

export default function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const onFilerClick = (key: string, value: string) => {
    searchParams.set(key, value);
    setSearchParams(searchParams);
  };

  return (
    <div className="space-y-20">
      <Hero title="Jobs" subtitle="Find the best jobs" />
      <div className="grid grid-cols-6 gap-20 items-start">
        <div className="grid grid-cols-3 col-span-4 gap-5">
          {Array.from({ length: 11 }).map((_, index) => (
            <JobCard
              key={`jobId-${index}`}
              id={`jobId-${index}`}
              company="Tesla"
              companyLogoUrl="https://github.com/facebook.png"
              companyHq="San Francisco, CA"
              title="Software Engineer"
              postedAt="12 hours ago"
              type="Full-time"
              positionLocation="Remote"
              salary="$100,000 - $120,000"
            />
          ))}
        </div>
        <div className="col-span-2 flex flex-col gap-10 sticky top-20">
          <div className="flex flex-col gap-2.5 items-start">
            <h4 className="text-sm text-muted-foreground font-bold">Type</h4>
            <div className="flex flex-wrap gap-2">
              {JOB_TYPES.map((jobType) => (
                <Button
                  variant="outline"
                  onClick={() => onFilerClick("type", jobType.value)}
                  className={cn(
                    jobType.value === searchParams.get("type")
                      ? "bg-accent"
                      : ""
                  )}
                >
                  {jobType.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2.5 items-start">
            <h4 className="text-sm text-muted-foreground font-bold">
              Location
            </h4>
            <div className="flex flex-wrap gap-2">
              {LOCATION_TYPES.map((locationType) => (
                <Button
                  variant="outline"
                  onClick={() => onFilerClick("location", locationType.value)}
                  className={cn(
                    locationType.value === searchParams.get("location")
                      ? "bg-accent"
                      : ""
                  )}
                >
                  {locationType.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2.5 items-start">
            <h4 className="text-sm text-muted-foreground font-bold">Salary</h4>
            <div className="flex flex-wrap gap-2">
              {SALARY_TYPES.map((salaryType) => (
                <Button
                  variant="outline"
                  onClick={() => onFilerClick("salary", salaryType)}
                  className={cn(
                    salaryType === searchParams.get("salary") ? "bg-accent" : ""
                  )}
                >
                  {salaryType}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
