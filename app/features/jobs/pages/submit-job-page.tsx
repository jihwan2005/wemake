import { Form } from "react-router";
import type { Route } from "./+types/submit-job-page";
import { Hero } from "~/common/components/hero";
import InputPair from "~/common/components/input-pair";
import SelectPair from "~/common/components/select-pair";
import { JOB_TYPES, LOCATION_TYPES, SALARY_TYPES } from "../constants";
import { Button } from "~/common/components/ui/button";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Post Job | WeMake" },
    { name: "description", content: "Submit a job" },
  ];
};

export default function SubmitJobPage() {
  return (
    <div>
      <Hero title="Post Job" subtitle="Reach out to the best candidates" />
      <Form className="max-w-screen-2xl mx-auto flex flex-col gap-10 items-center">
        <div className="grid grid-cols-3 gap-10 w-full">
          <InputPair
            id="position"
            label="Position"
            description="(40 characters)"
            name="position"
            maxLength={40}
            type="text"
            required
            placeholder="Software Engineer"
          />
          <InputPair
            id="overview"
            label="Overview"
            description="(400 characters)"
            name="overview"
            maxLength={400}
            type="text"
            required
            placeholder="We are looking for a software engineer with 3+ years of experience. The ideal candidate will have a strong understanding of software development principles and a passion for building scalable and efficient systems."
            textArea
          />
          <InputPair
            id="responsibilities"
            label="Responsibilities"
            description="(40 characters, comma separated)"
            name="responsibilities"
            maxLength={400}
            type="text"
            required
            placeholder="Implement new features, Debug issues, etc."
            textArea
          />
          <InputPair
            id="qualifications"
            label="Qualifications"
            description="(40 characters, comma separated)"
            name="qualifications"
            maxLength={400}
            type="text"
            required
            placeholder="Bachelor's degree in Computer Science or related field"
            textArea
          />
          <InputPair
            id="benefits"
            label="Benefits"
            description="(40 characters, comma separated)"
            name="benefits"
            maxLength={400}
            type="text"
            required
            placeholder="Healthcare, Dental, Vision, 401k"
            textArea
          />
          <InputPair
            id="skills"
            label="Skills"
            description="(40 characters, comma separated)"
            name="skills"
            maxLength={400}
            type="text"
            required
            placeholder="React, Node.js, Express, MongoDB"
            textArea
          />
          <InputPair
            id="companyName"
            label="Company Name"
            description="(40 characters)"
            name="companyName"
            maxLength={40}
            type="text"
            required
            placeholder="Meta Inc"
          />
          <InputPair
            id="companyLogoUrl"
            label="Company Logo Url"
            description="(40 characters)"
            name="companyLogoUrl"
            maxLength={40}
            type="url"
            required
            placeholder="https://example.com/logo.png"
          />
          <InputPair
            id="companyLocation"
            label="Company Location"
            description="(40 characters)"
            name="companyLocation"
            maxLength={40}
            type="text"
            required
            placeholder="San Francisco, CA"
          />
          <InputPair
            id="applyUrl"
            label="Apply Url"
            description="(40 characters)"
            name="applyUrl"
            maxLength={40}
            type="url"
            required
            placeholder="https://example.com/apply"
          />
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
