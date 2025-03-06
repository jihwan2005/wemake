import { DateTime } from "luxon";
import { data, isRouteErrorResponse, Link, useNavigate } from "react-router";
import { z } from "zod";
import { Hero } from "~/common/components/hero";
import { ProductCard } from "../components/product-card";
import { Button } from "~/common/components/ui/button";
import ProductPagination from "~/common/components/product-pagination";
import type { Route } from "./+types/monthly-leaderboard-page";

const paramsSchema = z.object({
  year: z.coerce.number(),
  month: z.coerce.number(),
});

export const meta: Route.MetaFunction = ({ params }) => {
  const { success, data: parsedData } = paramsSchema.safeParse(params);
  let title = "Monthly Leaderboard";
  if (success) {
    title = `Best of ${parsedData.year}/${parsedData.month}`;
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
    month: parsedData.month,
  }).setZone("Asia/Seoul");
  const today = DateTime.now().setZone("Asia/Seoul").startOf("month");

  if (!date.isValid || date > today) {
    return {
      year: today.year,
      month: today.month,
    };
  }
  return {
    ...parsedData,
  };
};

export default function MonthlyLeaderboardPage({
  loaderData,
}: Route.ComponentProps) {
  const today = DateTime.now().setZone("Asia/Seoul").startOf("month");
  const urlDate = DateTime.fromObject({
    year: loaderData.year,
    month: loaderData.month,
  });
  const previousMonth = urlDate.minus({ months: 1 });
  const nextMonth = urlDate.plus({ months: 1 });
  const isToday = urlDate.equals(today);

  const navigate = useNavigate();
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    let newYear = urlDate.year;
    let newMonth = urlDate.month;

    if (name === "year") {
      newYear = Number(value);
      if (DateTime.fromObject({ year: newYear, month: newMonth }) > today) {
        newMonth = today.month;
      }
    } else if (name === "month") {
      newMonth = Number(value);
      if (DateTime.fromObject({ year: newYear, month: newMonth }) > today) {
        newMonth = today.month;
      }
    }

    navigate(`/products/leaderboards/monthly/${newYear}/${newMonth}`);
  };

  const currentYear = today.year;
  const currentMonth = DateTime.now().month;
  const years = Array.from(
    { length: currentYear - 1999 },
    (_, i) => currentYear - i
  );
  const months = Array.from(
    { length: urlDate.year === currentYear ? currentMonth : 12 },
    (_, i) => i + 1
  );

  return (
    <div className="space-y-10">
      <Hero
        title={`Best of ${urlDate.toLocaleString({
          month: "long",
          year: "numeric",
        })}`}
      />

      <div className="flex gap-2 items-center justify-center">
        <select
          name="year"
          value={urlDate.year}
          onChange={handleSelectChange}
          className="px-4 py-2 w-28 border rounded-md h-9 bg-black text-white"
        >
          {years.map((year) => (
            <option key={year} value={year} className="bg-white text-black">
              {DateTime.fromObject({ year }).toLocaleString({
                year: "numeric",
              })}
            </option>
          ))}
        </select>
        <select
          name="month"
          value={urlDate.month}
          onChange={handleSelectChange}
          className="px-4 py-2 border rounded-md w-24 h-9 bg-black text-white"
        >
          {months.map((month) => (
            <option key={month} value={month} className="bg-white text-black">
              {DateTime.fromObject({
                year: urlDate.year,
                month,
              }).toLocaleString({
                month: "long",
              })}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-center gap-2">
        <Button variant="secondary" asChild>
          <Link
            to={`/products/leaderboards/monthly/${previousMonth.year}/${previousMonth.month}`}
          >
            &larr;{" "}
            {previousMonth.toLocaleString({
              month: "long",
              year: "2-digit",
            })}
          </Link>
        </Button>
        {!isToday ? (
          <Button variant="secondary" asChild>
            <Link
              to={`/products/leaderboards/monthly/${nextMonth.year}/${nextMonth.month}`}
            >
              {nextMonth.toLocaleString({
                month: "long",
                year: "2-digit",
              })}{" "}
              &rarr;
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
