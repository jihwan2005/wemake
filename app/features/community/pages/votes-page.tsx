import { useState } from "react";
import { Form, redirect } from "react-router";
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
import { RadioGroup, RadioGroupItem } from "~/common/components/ui/radio-group";
import { getLoggedInUserId } from "~/features/users/queries";
import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/votes-page";
import { createVotePost } from "~/features/products/mutations";
import { useNavigation } from "react-router";
import { LoaderCircle } from "lucide-react";
import { VotePostCard } from "../components/vote-post-card";
import { getVoteContent, getVotePosts } from "../queries";

const formSchema = z.object({
  title: z.string().min(1).max(40),
  content: z.string().min(1).max(1000),
  option_text: z.array(z.string().min(1).max(40)).max(5),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const formData = await request.formData();
  const parsedData = {
    title: formData.get("title"),
    content: formData.get("content"),
    option_text: formData.getAll("option_text[]"),
  };
  const { success, data, error } = formSchema.safeParse(parsedData);
  if (!success) {
    return {
      fieldErrors: error.flatten().fieldErrors,
    };
  }
  const { title, content, option_text } = data;
  await createVotePost(client, {
    title,
    content,
    optionTexts: option_text,
    userId,
  });
  return redirect("/community/votes");
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const { client } = makeSSRClient(request);
  const votePosts = await getVotePosts(client);
  const voteContents = await getVoteContent(client);
  return { votePosts, voteContents };
};

export default function VotesPage({ loaderData }: Route.ComponentProps) {
  const [optionCount, setOptionCount] = useState(2);
  const handleOptionCountChange = (value: string) => {
    setOptionCount(Number(value));
  };
  const navigation = useNavigation();
  const isSubmitting =
    navigation.state === "submitting" || navigation.state === "loading";
  return (
    <div>
      <Hero title="Votes" subtitle="Vote for your opinion" />
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">투표 올리기</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <Form method="post">
            <DialogHeader>
              <DialogTitle>투표 작성하기</DialogTitle>
              <DialogDescription>
                사람들에게 묻고 싶은 의견을 작성해주세요
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  제목
                </Label>
                <Input id="title" className="col-span-3" name="title" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="content" className="text-right">
                  의견
                </Label>
                <Input id="content" className="col-span-3" name="content" />
              </div>
              <DialogDescription>
                원하는 투표 옵션 개수를 선택해주세요
              </DialogDescription>
              <RadioGroup
                defaultValue="1"
                onValueChange={handleOptionCountChange}
              >
                <div className="flex gap-5">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2" id="r2" />
                    <Label htmlFor="r2">2개</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3" id="r3" />
                    <Label htmlFor="r3">3개</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="4" id="r4" />
                    <Label htmlFor="r4">4개</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="5" id="r5" />
                    <Label htmlFor="r5">5개</Label>
                  </div>
                </div>
              </RadioGroup>

              <div className="grid gap-4 py-4">
                {[...Array(optionCount)].map((_, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-4 items-center gap-4"
                  >
                    <Label
                      htmlFor={`option-${index + 1}`}
                      className="text-right"
                    >
                      옵션 {index + 1}
                    </Label>
                    <Input
                      id={`option-${index + 1}`}
                      name="option_text[]"
                      className="col-span-3"
                      placeholder={`투표 내용을 작성해주세요`}
                    />
                  </div>
                ))}
              </div>
            </div>
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                "Submit Vote"
              )}
            </Button>
          </Form>
        </DialogContent>
      </Dialog>
      <div className="mt-5 grid grid-cols-2 gap-5">
        {loaderData.votePosts.map((votePost) => {
          const correspondingVoteContents = loaderData.voteContents.filter(
            (voteContent) => voteContent.vote_post_id === votePost.vote_post_id
          );
          const optionContent =
            correspondingVoteContents?.map(
              (voteContent) => voteContent.option_text
            ) || [];
          const voteCount =
            correspondingVoteContents?.map(
              (voteContent) => voteContent.vote_count
            ) || [];
          const isVoted =
            correspondingVoteContents?.map(
              (voteContent) => voteContent.is_voted
            ) || [];
          return (
            <div key={votePost.vote_post_id}>
              <VotePostCard
                id={votePost.vote_post_id}
                title={votePost.title}
                content={votePost.content}
                author={votePost.author}
                authorAvatarUrl={votePost.author_avatar}
                postedAt={votePost.created_at}
                optionContent={optionContent}
                votesCount={voteCount}
                isVoted={isVoted}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
