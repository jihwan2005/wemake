import { LoaderCircle } from "lucide-react";
import { Await, data, Form, redirect, useNavigation } from "react-router";
import { z } from "zod";
import { Hero } from "~/common/components/hero";
import { Button } from "~/common/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/common/components/ui/dialog";
import { Input } from "~/common/components/ui/input";
import { Label } from "~/common/components/ui/label";
import { getLoggedInUserId } from "~/features/users/queries";
import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/faq-page";
import { createFaq } from "../mutations";
import { getFaq, getFaqPages } from "../queries";
import { FaqCard } from "../components/faq-card";
import FaqPagination from "~/common/components/faq-pagination";
import { Suspense, useState } from "react";

const formSchema = z.object({
  question: z.string().min(1).max(1000),
});

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const { client } = makeSSRClient(request);
  const { success, data: parsedData } = searchParamsSchema.safeParse(
    Object.fromEntries(url.searchParams)
  );
  if (!success) {
    throw data(
      {
        error_code: "invalid_search_params",
        message: "Invalid search params",
      },
      { status: 400 }
    );
  }
  const faqs = getFaq(client, {
    keyword: parsedData.keyword,
    page: Number(url.searchParams.get("page") || 1),
    limit: 7,
  });
  const totalPages = await getFaqPages(client, {
    keyword: parsedData.keyword,
  });
  return { faqs, totalPages };
};

export const action = async ({ request }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const formData = await request.formData();
  console.log("FormData entries:", [...formData.entries()]);
  const parsedData = {
    question: formData.get("question"),
  };
  const { success, data, error } = formSchema.safeParse(parsedData);
  if (!success) {
    return {
      fieldErrors: error.flatten().fieldErrors,
    };
  }
  const { question } = data;
  await createFaq(client, {
    question,
    userId,
  });
  return redirect("/faq");
};

const searchParamsSchema = z.object({
  keyword: z.string().optional(),
});

export default function FaqPage({ loaderData }: Route.ComponentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { faqs } = loaderData;
  const navigation = useNavigation();
  const isSubmitting =
    navigation.state === "submitting" || navigation.state === "loading";
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    await fetch("/faq", {
      method: "POST",
      body: formData,
    });

    setIsLoading(false);
    setIsOpen(false);
  };
  return (
    <div className="space-y-20">
      <Hero title="FAQ" subtitle="Frequently asked questions" />
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" onClick={() => setIsOpen(true)}>
            FAQ
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>질문 작성하기</DialogTitle>
            <DialogDescription>궁금한 점을 남겨주세요.</DialogDescription>
          </DialogHeader>
          <Form method="post" onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="question" className="text-right">
                  질문
                </Label>
                <Input id="question" className="col-span-3" name="question" />
              </div>
              <Button className="w-full" type="submit" disabled={isSubmitting}>
                {isSubmitting && isLoading ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  "Submit Question"
                )}
              </Button>
            </div>
          </Form>
        </DialogContent>
      </Dialog>

      <Suspense fallback={<div>loading...</div>}>
        <Await resolve={faqs}>
          {(data) => (
            <div className="space-y-5 grid grid-cols-3 gap-5">
              {data.map((faq) => (
                <FaqCard
                  key={faq.faq_id}
                  id={faq.faq_id}
                  question={faq.question}
                  author={faq.author}
                  authorAvatarUrl={faq.author_avatar}
                  postedAt={faq.created_at}
                />
              ))}
            </div>
          )}
        </Await>
      </Suspense>
      <FaqPagination totalPages={loaderData.totalPages} />
    </div>
  );
}
