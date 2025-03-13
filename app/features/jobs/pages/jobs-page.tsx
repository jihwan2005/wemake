import { Hero } from "~/common/components/hero";
import type { Route } from "./+types/jobs-page";
import { JobCard } from "../components/job-card";
import { Button } from "~/common/components/ui/button";
import { JOB_TYPES, LOCATION_TYPES, SALARY_TYPES } from "../constants";
import { Link, useSearchParams } from "react-router";
import { cn } from "~/lib/utils";
import { getJobs, getJobsPages } from "../queries";
import { z } from "zod";
import { data } from "react-router";
import JobPagination from "~/common/components/job-pagination";
import { Input } from "~/common/components/ui/input";
import { Form } from "react-router";
export const meta: Route.MetaFunction = () => {
  return [
    { title: "Jobs | wemake" },
    { name: "description", content: "Find your dream job at wemake" },
  ];
};

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
  const jobs = await getJobs({
    limit: 20,
    location: parsedData.location,
    type: parsedData.type,
    salary: parsedData.salary,
    page: Number(url.searchParams.get("page") || 1),
    keyword: parsedData.keyword,
  });
  const totalPages = await getJobsPages({
    location: parsedData.location,
    type: parsedData.type,
    salary: parsedData.salary,
    keyword: parsedData.keyword,
  });
  return { jobs, totalPages };
};

const searchParamsSchema = z.object({
  type: z
    .enum(JOB_TYPES.map((type) => type.value) as [string, ...string[]])
    .optional(),
  location: z
    .enum(LOCATION_TYPES.map((type) => type.value) as [string, ...string[]])
    .optional(),
  salary: z.enum(SALARY_TYPES).optional(),
  keyword: z.string().optional(),
});

export default function JobsPage({ loaderData }: Route.ComponentProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const onFilterClick = (key: string, value: string) => {
    if (searchParams.get(key) === value) {
      searchParams.delete(key);
    } else {
      searchParams.set(key, value);
    }
    setSearchParams(searchParams);
  };
  return (
    <div className="space-y-20">
      <Hero title="Jobs" subtitle="Companies looking for makers" />
      <Form className="w-2/3">
        <Input type="text" name="keyword" placeholder="Search for jobs" />
      </Form>
      <div className="grid grid-cols-1 xl:grid-cols-6 gap-20 items-start">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:col-span-4 gap-5">
          {loaderData.jobs.map((job) => (
            <JobCard
              key={job.job_id}
              id={job.job_id}
              company={job.company_name}
              companyLogoUrl={job.company_logo}
              companyHq={job.company_location}
              title={job.position}
              postedAt={job.created_at}
              type={job.job_type}
              positionLocation={job.location}
              salary={job.salary_range}
            />
          ))}
        </div>
        <div className="xl:col-span-2 sticky top-20 flex flex-col gap-10">
          <div className="flex flex-col items-start gap-2.5">
            <h4 className="text-sm text-muted-foreground font-bold">Type</h4>
            <div className="flex flex-wrap gap-2">
              {JOB_TYPES.map((type) => (
                <Button
                  variant={"outline"}
                  onClick={() => onFilterClick("type", type.value)}
                  className={cn(
                    type.value === searchParams.get("type") ? "bg-accent" : ""
                  )}
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-start gap-2.5">
            <h4 className="text-sm text-muted-foreground font-bold">
              Location
            </h4>
            <div className="flex flex-wrap gap-2">
              {LOCATION_TYPES.map((type) => (
                <Button
                  variant={"outline"}
                  onClick={() => onFilterClick("location", type.value)}
                  className={cn(
                    type.value === searchParams.get("location")
                      ? "bg-accent"
                      : ""
                  )}
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-start gap-2.5">
            <h4 className="text-sm text-muted-foreground font-bold">
              Salary Range
            </h4>
            <div className="flex flex-wrap gap-2">
              {SALARY_TYPES.map((range) => (
                <Button
                  variant={"outline"}
                  onClick={() => onFilterClick("salary", range)}
                  className={cn(
                    range === searchParams.get("salary") ? "bg-accent" : ""
                  )}
                >
                  {range}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <JobPagination totalPages={loaderData.totalPages} />
    </div>
  );
}