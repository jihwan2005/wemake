import type { Route } from "~/+types/routes";
import type { MetaFunction } from "react-router";
import { Hero } from "~/common/components/hero";
import { Form } from "react-router";
import InputPair from "~/common/components/input-pair";
import SelectPair from "~/common/components/select-pair";
import { Input } from "~/common/components/ui/input";
import { Label } from "~/common/components/ui/label";
import { useState } from "react";
import { Button } from "~/common/components/ui/button";

export const meta: MetaFunction = () => {
  return [
    { title: "Submit Product | wemake" },
    { name: "description", content: "Submit your product" },
  ];
};

export default function SubmitPage({ actionData }: Route.ComponentProps) {
  const [icon, setIcon] = useState<string | null>(null);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (e.target.files) {
      const file = e.target.files[0];
      setIcon(URL.createObjectURL(file));
    }
  };
  return (
    <div>
      <Hero title="Submit Product" subtitle="Submit your product" />
      <Form className="grid grid-cols-2 gap-10 max-w-screen-lg mx-auto">
        <div className="space-y-5">
          <InputPair
            label="Product Name"
            description="This is the name of your product."
            id="name"
            name="name"
            required
            type="text"
            placeholder="Name of your product"
          />
          <InputPair
            label="Tagline"
            description="60 characters or less"
            id="tagline"
            name="tagline"
            required
            placeholder="A concise description of your product"
            type="text"
          />
          <InputPair
            label="URL"
            description="The URL of your product."
            id="url"
            name="url"
            required
            placeholder="https://example.com"
            type="text"
          />
          <InputPair
            textArea
            label="Description"
            description="A detailed description of your product."
            id="description"
            name="description"
            required
            placeholder="A detailed description of your product."
            type="text"
          />
          <SelectPair
            label="Category"
            description="The category of your product."
            name="category"
            required
            placeholder="Select a category"
            options={[
              { label: "Category 1", value: "category-1" },
              { label: "Category 2", value: "category-2" },
              { label: "Category 3", value: "category-3" },
            ]}
          />
          <Button type="submit" className="w-full" size="lg">
            Submit
          </Button>
        </div>
        <div className="flex flex-col space-y-2">
          {icon ? (
            <div className="size-40 rounded-xl shadow-xl overflow-hidden">
              <img src={icon} className="object-cover w-full h-full" />
            </div>
          ) : null}
          <Label className="flex flex-col gap-1">
            Icon{" "}
            <small className="text-muted-foreground">
              The icon of your product.
            </small>
          </Label>
          <Input
            type="file"
            className="w-1/2"
            onChange={onChange}
            required
            name="icon"
          />
          <div className="flex flex-col text-xs">
            <span className="text-muted-foreground">
              Recommended size : 128x129px
            </span>
            <span className="text-muted-foreground">
              Allowed formats : PNG, JPEG
            </span>
            <span className="text-muted-foreground">Max size : 1MB</span>
          </div>
        </div>
      </Form>
    </div>
  );
}
