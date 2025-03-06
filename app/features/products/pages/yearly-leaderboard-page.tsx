import { DateTime } from "luxon";
import type { Route } from "./+types/monthly-leaderboard-page";
import { data, isRouteErrorResponse, Link, useNavigate } from "react-router";
import { z } from "zod";
import { Hero } from "~/common/components/hero";
import { ProductCard } from "../components/product-card";
import { Button } from "~/common/components/ui/button";
import ProductPagination from "~/common/components/product-pagination";

const paramsSchema = z.object({
  year: z.coerce.number(),
});

export const meta: Route.MetaFunction = ({ params }) => {
  const { success, data: parsedData } = paramsSchema.safeParse(params);
  let title = "Yearly Leaderboard";
  if (success) {
    title = `Best of ${parsedData.year}`;
  }
  return [{ title: `${title} | wmake` }];
};

export const loader = ({ params }: Route.LoaderArgs) => {
  const { success, data: parsedData } = paramsSchema.safeParse(params);
  if (!success) {
    throw data(
      {
        error_code: "invalid_params",
        message: "Invalid params",
      },
      { status: 400 }
    );
  }
  const date = DateTime.fromObject({
    year: parsedData.year,
  }).setZone("Asia/Seoul");
  if (!date.isValid) {
    throw data(
      {
        error_code: "invalid_date",
        message: "Invalid date",
      },
      {
        status: 400,
      }
    );
  }
  const today = DateTime.now().setZone("Asia/Seoul").startOf("year");
  if (date > today) {
    throw data(
      {
        error_code: "future_date",
        message: "Future date",
      },
      { status: 400 }
    );
  }
  return {
    ...parsedData,
  };
};

export default function YearlyLeaderboardPage({
  loaderData,
}: Route.ComponentProps) {
  const urlDate = DateTime.fromObject({ year: loaderData.year });
  const previousYear = urlDate.minus({ years: 1 });
  const nextYear = urlDate.plus({ years: 1 });
  const isToday = urlDate.equals(DateTime.now().startOf("year"));

  // 년도 선택 select 태그 처리
  const navigate = useNavigate();
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const year = event.target.value;
    navigate(`/products/leaderboards/yearly/${year}`);
  };

  const currentYear = DateTime.now().year;
  const years = Array.from(
    { length: currentYear - 1999 },
    (_, i) => currentYear - i
  );

  return (
    <div className="space-y-10">
      <Hero title={`Best of ${urlDate.year}년`} />

      {/* 년도 선택 select */}
      <div className="flex gap-2 items-center justify-center">
        <select
          value={urlDate.year}
          onChange={handleSelectChange}
          className="px-4 py-2 border rounded-md w-28 h-9 bg-black text-white"
        >
          {years.map((year) => (
            <option key={year} value={year} className="bg-white text-black">
              {DateTime.fromObject({ year }).toLocaleString({
                year: "numeric",
              })}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-center gap-2">
        <Button variant="secondary" asChild>
          <Link to={`/products/leaderboards/yearly/${previousYear.year}`}>
            &larr; {previousYear.year}
          </Link>
        </Button>
        {!isToday ? (
          <Button variant="secondary" asChild>
            <Link to={`/products/leaderboards/yearly/${nextYear.year}`}>
              {nextYear.year} &rarr;
            </Link>
          </Button>
        ) : null}
      </div>

      <div className="space-y-5 w-full max-w-screen-md mx-auto">
        {Array.from({ length: 11 }).map((_, index) => (
          <ProductCard
            key={`productId-${index}`}
            id={`productId-${index}`}
            name="Product Name"
            description="Product Description"
            commentsCount={12}
            viewsCount={12}
            votesCount={120}
          />
        ))}
      </div>
      <ProductPagination totalPages={10} />
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        {error.data.message} / {error.data.error_code}
      </div>
    );
  }
  if (error instanceof Error) {
    return <div>{error.message}</div>;
  }
  return <div>Unknown error</div>;
}
