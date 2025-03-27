import { Form } from "react-router";
import { Hero } from "~/common/components/hero";
import InputPair from "~/common/components/input-pair";
import { Button } from "~/common/components/ui/button";

export default function SubmitFeedbackPage() {
  return (
    <div className="space-y-20">
      <Hero title="Submit Feedback" subtitle="Submit your feedback" />
      <Form
        className="grid grid-cols-2 gap-10 max-w-screen-lg mx-auto"
        encType="multipart/form-data"
        method="post"
      >
        <div className="space-y-5">
          <InputPair
            label="Content"
            description="Write a Feedback"
            id="content"
            name="content"
            required
            placeholder="Content of Feedback"
            type="text"
            textArea
          />
          <Button type="submit" className="w-full" size="lg">
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
}
