export const JOB_TYPES = [
  {
    label: "Full-time",
    value: "full-time",
  },
  {
    label: "Part-time",
    value: "part-time",
  },
  {
    label: "Hybrid",
    value: "hybrid",
  },
  {
    label: "Freelance",
    value: "freelance",
  },
  {
    label: "Internship",
    value: "internship",
  },
] as const;

export const LOCATION_TYPES = [
  {
    label: "Remote",
    value: "remote",
  },
  {
    label: "In-person",
    value: "in-person",
  },
  {
    label: "Hybrid",
    value: "hybrid",
  },
] as const;

export const SALARY_TYPES = [
  "$0 - $10,000",
  "$10,000 - $20,000",
  "$20,000 - $30,000",
  "$30,000 - $40,000",
  "$40,000 - $50,000",
  "$50,000 - $60,000",
  "$60,000 - $70,000",
] as const;

export const PAGE_SIZE = 2;
