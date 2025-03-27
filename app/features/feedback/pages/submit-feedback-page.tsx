import { Form, redirect, useNavigation } from "react-router";
import { Hero } from "~/common/components/hero";
import InputPair from "~/common/components/input-pair";
import { Button } from "~/common/components/ui/button";
import type { Route } from "./+types/submit-feedback-page";
import { makeSSRClient } from "~/supa-client";
import { getLoggedInUserId } from "~/features/users/queries";
import { z } from "zod";
import { createFeedback } from "../mutations";
import { LoaderCircle } from "lucide-react";

const formSchema = z.object({
  content: z.string().min(1).max(1000),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const formData = await request.formData();
  const { success, data, error } = formSchema.safeParse(
    Object.fromEntries(formData)
  );
  if (!success) {
    return {
      fieldErrors: error.flatten().fieldErrors,
    };
  }
  const { content } = data;
  await createFeedback(client, {
    content,
    userId,
  });
  return redirect("/feedback");
};

export default function SubmitFeedbackPage() {
  const navigation = useNavigation();
  const isSubmitting =
    navigation.state === "submitting" || navigation.state === "loading";
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
          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              "Submit Feedback"
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
}
