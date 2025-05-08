import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/class-quiz-page";
import { getClassQuestionByQuizId } from "../data/queries";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "~/common/components/ui/carousel";
import { Card, CardContent } from "~/common/components/ui/card";
import { Button } from "~/common/components/ui/button";

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { client } = await makeSSRClient(request);
  const quizId = params.quizId;
  const questions = await getClassQuestionByQuizId(client, { quizId });
  return { questions };
};

export default function ClassQuizPage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="space-y-20 flex justify-center w-full">
      <div className="w-1/2 bg-amber-100 h-[800px] flex flex-col items-center justify-center">
        <Carousel className="w-7/8">
          <CarouselContent>
            {loaderData.questions.map((question) => (
              <CarouselItem>
                <Card>
                  <CardContent className=" w-full h-[650px] flex flex-col">
                    <div className="w-full flex justify-start">
                      <span>{question.question_position}</span>
                      <span>{question.question_text}</span>
                    </div>
                    <div>
                      {question.class_quiz_choices.map((choice) => (
                        <div className="flex flex-col gap-2">
                          <Button variant="outline">
                            {choice.choice_text}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}
