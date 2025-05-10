import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/class-quiz-insight-page";
import {
  getClassQuizDescriptiveInsight,
  getClassQuizInsight,
  getClassQuizStudentScore,
} from "../data/queries";

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { client } = await makeSSRClient(request);
  const quizId = params.quizId;
  const stats = await getClassQuizInsight(client, {
    quizId,
  });
  const descStats = await getClassQuizDescriptiveInsight(client, {
    quizId,
  });
  const scores = await getClassQuizStudentScore(client, {
    quizId,
  });
  return { stats, descStats, scores };
};

export default function ClassQuizInsightPage({
  loaderData,
}: Route.ComponentProps) {
  const stats = loaderData.stats;
  const descStats = loaderData.descStats;
  const scores = loaderData.scores;
  const quizSummary = stats[0];
  return (
    <div className="grid grid-cols-8 gap-4">
      {/* 왼쪽 1 (성적순 학생 리스트) */}
      <div className="col-span-1 border rounded p-2 bg-white overflow-auto max-h-screen">
        <h2 className="text-lg font-bold mb-2">성적 순</h2>
        {scores.map((s, idx) => (
          <div key={s.profile_id} className="text-sm mb-1">
            {idx + 1}등. {s.username ?? "익명"} ({s.total_score}점)
          </div>
        ))}
      </div>

      {/* 오른쪽 7 (퀴즈 통계) */}
      <div className="col-span-7 space-y-6">
        {/* 요약 정보 */}
        <div className="flex flex-col gap-1 border p-4 rounded bg-gray-100">
          <strong>평균 점수: {quizSummary.average_score}</strong>
          <strong>총 응시자 수: {quizSummary.student_count}</strong>
        </div>

        {/* 객관식 */}
        <h2 className="text-xl font-semibold">객관식</h2>
        {stats.map((s) => (
          <div key={s.question_id} className="border p-4 rounded">
            <h3 className="font-semibold">{s.question_text}</h3>
            <p>총 응답 수: {s.total_answers}</p>
            <p>정답 수: {s.correct_count}</p>
            <p>오답 수: {s.wrong_count}</p>
            <p className="text-red-500">오답률: {s.wrong_rate_percent}%</p>
            <p>✅ 확신: {s.confident_count}</p>
            <p>❓ 애매: {s.unsure_count}</p>
            <p>❌ 미응답: {s.unanswered_count}</p>
          </div>
        ))}

        {/* 서술형 */}
        <h2 className="text-xl font-semibold">서술형</h2>
        {descStats.map((s) => (
          <div key={s.question_id} className="border p-4 rounded">
            <h3 className="font-semibold">{s.question_text}</h3>
            <p>총 응답 수: {s.total_answers}</p>
            <p>평균 점수: {s.average_score}</p>
            <p>✅ 확신: {s.confident_count}</p>
            <p>❓ 애매: {s.unsure_count}</p>
            <p>❌ 미응답: {s.unanswered_count}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
