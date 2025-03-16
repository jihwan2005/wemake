import { Form, redirect } from "react-router";
import type { Route } from "./+types/submit-job-page";
import { Hero } from "~/common/components/hero";
import InputPair from "~/common/components/input-pair";
import SelectPair from "~/common/components/select-pair";
import { JOB_TYPES, LOCATION_TYPES, SALARY_TYPES } from "../constants";
import { Button } from "~/common/components/ui/button";
import { makeSSRClient } from "~/supa-client";
import { getLoggedInUserId } from "~/features/users/queries";
import { z } from "zod";
import { createJob } from "../mutations";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Post Job | WeMake" },
    { name: "description", content: "Submit a job" },
  ];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);
  await getLoggedInUserId(client);
};

export const formSchema = z.object({
  position: z.string().min(1).max(40),
  overview: z.string().min(1).max(400),
  responsibilities: z.string().min(1).max(400),
  qualifications: z.string().min(1).max(400),
  benefits: z.string().min(1).max(400),
  skills: z.string().min(1).max(400),
  companyName: z.string().min(1).max(40),
  companyLogoUrl: z.string().min(1).max(40),
  companyLocation: z.string().min(1).max(40),
  applyUrl: z.string().min(1).max(40),
  jobType: z.enum(
    JOB_TYPES.map((jobType) => jobType.value) as [string, ...string[]]
  ),
  jobLocation: z.enum(
    LOCATION_TYPES.map((jobLocation) => jobLocation.value) as [
      string,
      ...string[]
    ]
  ),
  salary: z.enum(SALARY_TYPES),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);
  await getLoggedInUserId(client);
  const formData = await request.formData();
  const { success, data, error } = formSchema.safeParse(
    Object.fromEntries(formData)
  );
  if (!success) {
    return {
      fieldErrors: error.flatten().fieldErrors,
    };
  }
  const { job_id } = await createJob(client, data);
  return redirect(`/jobs/${job_id}`);
};

export default function SubmitJobPage({ actionData }: Route.ComponentProps) {
  return (
    <div>
      <Hero title="Post Job" subtitle="Reach out to the best candidates" />
      <Form
        className="max-w-screen-2xl mx-auto flex flex-col gap-10 items-center"
        method="post"
      >
        <div className="grid grid-cols-3 gap-10 w-full">
          <InputPair
            id="position"
            label="Position"
            description="(40 characters)"
            name="position"
            maxLength={40}
            type="text"
            required
            defaultValue="Senior React Developer"
          />
          {actionData && "fieldErrors" in actionData && (
            <p className="text-red-500">{actionData.fieldErrors.position}</p>
          )}
          <InputPair
            id="overview"
            label="Overview"
            description="(400 characters)"
            name="overview"
            maxLength={400}
            type="text"
            required
            defaultValue="We are looking for a Senior React Developer"
            textArea
          />
          {actionData && "fieldErrors" in actionData && (
            <p className="text-red-500">{actionData.fieldErrors.overview}</p>
          )}
          <InputPair
            id="responsibilities"
            label="Responsibilities"
            description="(40 characters, comma separated)"
            name="responsibilities"
            maxLength={400}
            type="text"
            required
            defaultValue="Implement new features, Maintain code quality, etc."
            textArea
          />
          {actionData && "fieldErrors" in actionData && (
            <p className="text-red-500">
              {actionData.fieldErrors.responsibilities}
            </p>
          )}
          <InputPair
            id="qualifications"
            label="Qualifications"
            description="(40 characters, comma separated)"
            name="qualifications"
            maxLength={400}
            type="text"
            required
            defaultValue="3+ years of experience, Strong TypeScript skills, etc."
            textArea
          />
          {actionData && "fieldErrors" in actionData && (
            <p className="text-red-500">
              {actionData.fieldErrors.qualifications}
            </p>
          )}
          <InputPair
            id="benefits"
            label="Benefits"
            description="(40 characters, comma separated)"
            name="benefits"
            maxLength={400}
            type="text"
            required
            defaultValue="Flexible working hours, Health insurance, etc."
            textArea
          />
          {actionData && "fieldErrors" in actionData && (
            <p className="text-red-500">{actionData.fieldErrors.benefits}</p>
          )}
          <InputPair
            id="skills"
            label="Skills"
            description="(40 characters, comma separated)"
            name="skills"
            maxLength={400}
            type="text"
            required
            defaultValue="React, TypeScript, etc."
            textArea
          />
          {actionData && "fieldErrors" in actionData && (
            <p className="text-red-500">{actionData.fieldErrors.skills}</p>
          )}
          <InputPair
            id="companyName"
            label="Company Name"
            description="(40 characters)"
            name="companyName"
            maxLength={40}
            type="text"
            required
            defaultValue="wemake"
          />
          {actionData && "fieldErrors" in actionData && (
            <p className="text-red-500">{actionData.fieldErrors.companyName}</p>
          )}
          <InputPair
            id="companyLogoUrl"
            label="Company Logo Url"
            description="(40 characters)"
            name="companyLogoUrl"
            maxLength={40}
            type="url"
            required
            defaultValue="https://wemake.services/logo.png"
          />
          {actionData && "fieldErrors" in actionData && (
            <p className="text-red-500">
              {actionData.fieldErrors.companyLogoUrl}
            </p>
          )}
          <InputPair
            id="companyLocation"
            label="Company Location"
            description="(40 characters)"
            name="companyLocation"
            maxLength={40}
            type="text"
            required
            defaultValue="Remote, New York, etc."
          />
          {actionData && "fieldErrors" in actionData && (
            <p className="text-red-500">
              {actionData.fieldErrors.companyLocation}
            </p>
          )}
          <InputPair
            id="applyUrl"
            label="Apply Url"
            description="(40 characters)"
            name="applyUrl"
            maxLength={40}
            type="url"
            required
            defaultValue="https://wemake.services/apply"
          />
          {actionData && "fieldErrors" in actionData && (
            <p className="text-red-500">{actionData.fieldErrors.applyUrl}</p>
          )}
          <SelectPair
            label="Job Type"
            description="Select the job type"
            name="jobType"
            required
            placeholder="Select the job type"
            options={JOB_TYPES.map((jobType) => ({
              label: jobType.label,
              value: jobType.value,
            }))}
          />
          {actionData && "fieldErrors" in actionData && (
            <p className="text-red-500">{actionData.fieldErrors.jobType}</p>
          )}
          <SelectPair
            label="Job Location"
            description="Select the job location"
            name="jobLocation"
            required
            placeholder="Select the job location"
            options={LOCATION_TYPES.map((jobLocation) => ({
              label: jobLocation.label,
              value: jobLocation.value,
            }))}
          />
          {actionData && "fieldErrors" in actionData && (
            <p className="text-red-500">{actionData.fieldErrors.jobLocation}</p>
          )}
          <SelectPair
            label="Salary"
            description="Select the salary"
            name="salary"
            required
            placeholder="Select the salary"
            options={SALARY_TYPES.map((salary) => ({
              label: salary,
              value: salary,
            }))}
          />
          {actionData && "fieldErrors" in actionData && (
            <p className="text-red-500">{actionData.fieldErrors.salary}</p>
          )}
        </div>
        <Button
          type="submit"
          className="w-full mx-auto max-w-screen-sm"
          size="lg"
        >
          Post Job
        </Button>
      </Form>
    </div>
  );
}
