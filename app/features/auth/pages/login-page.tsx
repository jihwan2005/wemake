import { Button } from "~/common/components/ui/button";

import { Form, Link, redirect, useNavigation } from "react-router";
import InputPair from "~/common/components/input-pair";
import type { Route } from "./+types/login-page";
import AuthButtons from "../components/auth-buttons";
import { LoaderCircle } from "lucide-react";
import { z } from "zod";
import { makeSSRClient } from "~/supa-client";
export const meta: Route.MetaFunction = () => {
  return [{ title: "Login | wemake" }];
};

const formSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email(),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(3, {
      message: "Password must be at least 3 characters long",
    }),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const { success, data, error } = formSchema.safeParse(
    Object.fromEntries(formData)
  );
  if (!success) {
    return {
      loginError: null,
      formErrors: error.flatten().fieldErrors,
    };
  }
  const { email, password } = data;
  const { client, headers } = makeSSRClient(request);
  const { error: loginError } = await client.auth.signInWithPassword({
    email,
    password,
  });
  if (loginError) {
    return {
      formErrors: null,
      loginError: loginError.message,
    };
  }
  return redirect("/", { headers });
};

export default function LoginPage({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting =
    navigation.state === "submitting" || navigation.state === "loading";
  return (
    <div className="flex flex-col relative items-center justify-center h-full">
      <Button variant={"ghost"} asChild className="absolute right-8 top-8 ">
        <Link to="/auth/join">Join</Link>
      </Button>
      <div className="flex items-center flex-col justify-center w-full max-w-md gap-10">
        <h1 className="text-2xl font-semibold">Log in to your account</h1>
        <Form className="w-full space-y-4" method="post">
          <InputPair
            label="Email"
            description="Enter your email address"
            name="email"
            id="email"
            required
            type="email"
            placeholder="email"
          />
          {actionData && "formErrors" in actionData && (
            <p className="text-red-500">
              {actionData.formErrors?.email?.join(",")}
            </p>
          )}
          <InputPair
            id="password"
            label="Password"
            description="Enter your password"
            name="password"
            required
            type="password"
            placeholder="password"
          />
          {actionData && "formErrors" in actionData && (
            <p className="text-red-500">
              {actionData.formErrors?.password?.join(",")}
            </p>
          )}
          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <LoaderCircle className="w-4 h-4 animate-spin" />
            ) : (
              "Log in"
            )}
          </Button>
          {actionData && "loginError" in actionData && (
            <p className="text-red-500">{actionData.loginError}</p>
          )}
        </Form>
        <AuthButtons />
      </div>
    </div>
  );
}
