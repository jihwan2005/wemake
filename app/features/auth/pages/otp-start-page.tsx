import { Button } from "~/common/components/ui/button";
import { Form, Link, redirect, useNavigation } from "react-router";
import InputPair from "~/common/components/input-pair";
import type { Route } from "./+types/otp-start-page";
import { z } from "zod";
import { makeSSRClient } from "~/supa-client";
import { LoaderCircle } from "lucide-react";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Start OTP - ProductHunt Clone" }];
};

const formSchema = z.object({
  email: z.string().email(),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const { success, data } = formSchema.safeParse(Object.fromEntries(formData));
  if (!success) {
    return { error: "Invalid email address" };
  }
  const { email } = data;
  const { client } = makeSSRClient(request);
  const { error } = await client.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
    },
  });
  if (error) {
    return { error: "Failed to send OTP" };
  }
  return redirect(`/auth/otp/complete?email=${email}`);
};

export default function OtpStartPage({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting =
    navigation.state === "submitting" || navigation.state === "loading";
  return (
    <div className="flex flex-col relative items-center justify-center h-full">
      <div className="flex items-center flex-col justify-center w-full max-w-md gap-10">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Log in with OTP</h1>
          <p>We will send you a 4-digit code to verify your account.</p>
        </div>
        <Form className="w-full space-y-4" method="post">
          <InputPair
            label="Email"
            description="Enter your email address"
            name="email"
            id="email"
            required
            type="email"
            placeholder="i.e wemake@example.com"
          />
          {actionData && "error" in actionData && (
            <p className="text-red-500">{actionData.error}</p>
          )}
          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <LoaderCircle className="w-4 h-4 animate-spin" />
            ) : (
              "Send OTP"
            )}
          </Button>
        </Form>
      </div>
    </div>
  );
}
