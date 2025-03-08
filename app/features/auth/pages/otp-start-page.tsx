import { Button } from "~/common/components/ui/button";
import { Form, Link } from "react-router";
import InputPair from "~/common/components/input-pair";
import type { Route } from "./+types/otp-start-page";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Start OTP - ProductHunt Clone" }];
};

export default function OtpStartPage() {
  return (
    <div className="flex flex-col relative items-center justify-center h-full">
      <div className="flex items-center flex-col justify-center w-full max-w-md gap-10">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Log in with OTP</h1>
          <p>We will send you a 4-digit code to verify your account.</p>
        </div>
        <Form className="w-full space-y-4">
          <InputPair
            label="Email"
            description="Enter your email address"
            name="email"
            id="email"
            required
            type="email"
            placeholder="i.e wemake@example.com"
          />
          <Button className="w-full" type="submit">
            Send OTP
          </Button>
        </Form>
      </div>
    </div>
  );
}
