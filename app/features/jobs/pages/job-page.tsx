import { Badge } from "~/common/components/ui/badge";
import { DotIcon } from "lucide-react";
import type { Route } from "./+types/job-page";
import { Button } from "~/common/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/common/components/ui/accordion";
import { Separator } from "~/common/components/ui/separator";
import { getJobById } from "../queries";
import { DateTime } from "luxon";
import { makeSSRClient } from "~/supa-client";
export const meta: Route.MetaFunction = () => {
  return [
    { title: "Job | WeMake" },
    { name: "description", content: "Find the best job" },
  ];
};

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);
  const job = await getJobById(client, { jobId: params.jobId });
  return { job };
};

export default function JobPage({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <div className="bg-gradient-to-tr from-primary/80 to-primary/10 h-60 w-full rounded-lg"></div>
      <div className="grid grid-cols-6 gap-20 items-start -mt-20">
        <div className="col-span-4 space-y-5">
          <div className="flex flex-col gap-2.5">
            <div className="size-40 bg-white rounded-full overflow-hidden border-white relative left-10">
              <img src={loaderData.job.company_logo} className="object-cover" />
            </div>
            <h1 className="text-4xl font-bold">{loaderData.job.position}</h1>
            <h4 className="text-lg text-muted-foreground">
              {loaderData.job.company_name}
            </h4>
          </div>
          <div className="flex gap-2 capitalize">
            <Badge variant="secondary">{loaderData.job.job_type}</Badge>
            <Badge variant="secondary">{loaderData.job.location}</Badge>
          </div>
          <div className="space-y-2.5">
            <h4 className="text-2xl font-bold">Overview</h4>
            <p className="text-lg">{loaderData.job.overview}</p>
          </div>
          <Accordion type="single" collapsible>
            <AccordionItem value="qualifications">
              <AccordionTrigger className="text-2xl font-bold">
                Qualifications
              </AccordionTrigger>
              <AccordionContent>
                <ul className="text-lg list-disc list-inside">
                  {loaderData.job.qualifications.split(",").map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Separator />
          <Accordion type="single" collapsible>
            <AccordionItem value="responsibilities">
              <AccordionTrigger className="text-2xl font-bold">
                Responsibilities
              </AccordionTrigger>
              <AccordionContent>
                <ul className="text-lg list-disc list-inside">
                  {loaderData.job.responsibilities.split(",").map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Separator />
          <Accordion type="single" collapsible>
            <AccordionItem value="skills">
              <AccordionTrigger className="text-2xl font-bold">
                Skills
              </AccordionTrigger>
              <AccordionContent>
                <ul className="text-lg list-disc list-inside">
                  {loaderData.job.skills.split(",").map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="col-span-2 space-y-5 sticky top-20 border rounded-lg mt-32 p-6">
          <div className="flex flex-col">
            <span className="text-2xl font-medium">
              {loaderData.job.salary_range}
            </span>
            <span className="text-sm font-medium">Avg. Salary</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-medium capitalize">
              {loaderData.job.location}
            </span>
            <span className="text-sm font-medium">Location</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-medium capitalize">
              {loaderData.job.job_type}
            </span>
            <span className="text-sm font-medium">Type</span>
          </div>
          <div className="flex">
            <span className="text-sm font-medium">
              Posted {DateTime.fromISO(loaderData.job.created_at).toRelative()}
            </span>
            <DotIcon className="size-4" />
            <span className="text-sm text-muted-foreground">100 views</span>
          </div>
          <Button>Apply</Button>
        </div>
      </div>
    </div>
  );
}
