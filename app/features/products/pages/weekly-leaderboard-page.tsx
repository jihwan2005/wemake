import { DateTime } from "luxon";
import type { Route } from "./+types/weekly-leaderboard-page";
import { data, isRouteErrorResponse } from "react-router";
import { z } from "zod";
import { Hero } from "~/common/components/hero";
import { ProductCard } from "../components/product-card";
import ProductPagination from "~/common/components/product-pagination";
import { useState, useEffect } from "react";
import { getProductsByDateRange, getProductPagesByDateRange } from "../queries";
import { makeSSRClient } from "~/supa-client";
const paramsSchema = z.object({
  year: z.coerce.number(),
  week: z.coerce.number(),
});

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const { success, data: parsedData } = paramsSchema.safeParse(params);
  if (!success) {
    throw data(
      { error_code: "invalid_params", message: "Invalid params" },
      { status: 400 }
    );
  }

  const date = DateTime.fromObject({
    weekYear: parsedData.year,
    weekNumber: parsedData.week,
  }).setZone("Asia/Seoul");

  if (!date.isValid) {
    throw data(
      { error_code: "invalid_date", message: "Invalid date" },
      { status: 400 }
    );
  }

  const today = DateTime.now().setZone("Asia/Seoul").startOf("week");
  if (date > today) {
    throw data(
      { error_code: "future_date", message: "Future date" },
      { status: 400 }
    );
  }
  const url = new URL(request.url);
  const { client } = makeSSRClient(request);
  const products = await getProductsByDateRange(client, {
    startDate: date.startOf("week"),
    endDate: date.endOf("week"),
    limit: 15,
    page: Number(url.searchParams.get("page") || 1),
  });
  const totalPages = await getProductPagesByDateRange(client, {
    startDate: date.startOf("week"),
    endDate: date.endOf("week"),
  });

  return {
    products,
    totalPages,
    ...parsedData,
  };
};

export default function WeeklyLeaderboardPage({
  loaderData,
}: Route.ComponentProps) {
  const today = DateTime.now().setZone("Asia/Seoul");
  const maxAvailableWeek = today.weekNumber;
  const maxAvailableYear = today.year;

  const [selectedYear, setSelectedYear] = useState(loaderData.year);
  const [selectedWeek, setSelectedWeek] = useState(loaderData.week);

  useEffect(() => {
    if (selectedYear === maxAvailableYear && selectedWeek > maxAvailableWeek) {
      setSelectedWeek(maxAvailableWeek);
      window.location.href = `/products/leaderboards/weekly/${maxAvailableYear}/${maxAvailableWeek}`;
    }
  }, [selectedYear]);

  const years = Array.from(
    { length: maxAvailableYear - 2000 + 1 },
    (_, i) => 2000 + i
  ).reverse();

  const weeks = Array.from({ length: 52 }, (_, i) => i + 1).filter(
    (week) => selectedYear < maxAvailableYear || week <= maxAvailableWeek
  );

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = Number(e.target.value);
    setSelectedYear(year);
    if (year === maxAvailableYear && selectedWeek > maxAvailableWeek) {
      setSelectedWeek(maxAvailableWeek);
      window.location.href = `/products/leaderboards/weekly/${year}/${maxAvailableWeek}`;
    } else {
      window.location.href = `/products/leaderboards/weekly/${year}/${selectedWeek}`;
    }
  };

  const handleWeekChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const week = Number(e.target.value);
    setSelectedWeek(week);
    window.location.href = `/products/leaderboards/weekly/${selectedYear}/${week}`;
  };

  // 주차 시작일과 종료일 계산
  const getWeekDateRange = (year: number, week: number) => {
    const weekStart = DateTime.fromISO(`${year}-01-01`)
      .plus({ weeks: week - 1 })
      .startOf("week")
      .setZone("Asia/Seoul")
      .toFormat("MM/dd");

    const weekEnd = DateTime.fromISO(`${year}-01-01`)
      .plus({ weeks: week - 1 })
      .endOf("week")
      .setZone("Asia/Seoul")
      .toFormat("MM/dd");

    return { weekStart, weekEnd };
  };

  return (
    <div className="space-y-10">
      <Hero
        title={`Best of week ${selectedYear}년 ${selectedWeek}주차 (${
          getWeekDateRange(selectedYear, selectedWeek).weekStart
        } ~ ${getWeekDateRange(selectedYear, selectedWeek).weekEnd})`}
      />
      <div className="flex items-center justify-center gap-2">
        <select
          value={selectedYear}
          onChange={handleYearChange}
          className="border p-2 rounded bg-black text-white h-9"
        >
          {years.map((year) => (
            <option key={year} value={year} className="bg-white text-black">
              {year}
            </option>
          ))}
        </select>
        <select
          value={selectedWeek}
          onChange={handleWeekChange}
          className="border p-2 rounded bg-black text-white h-9"
        >
          {weeks.map((week) => {
            const { weekStart, weekEnd } = getWeekDateRange(selectedYear, week);
            return (
              <option key={week} value={week} className="bg-white text-black">
                {`${week}주차 (${weekStart} ~ ${weekEnd})`}
              </option>
            );
          })}
        </select>
      </div>
      <div className="space-y-5 w-full max-w-screen-md mx-auto">
        {loaderData.products.map((product) => (
          <ProductCard
            key={product.product_id}
            id={product.product_id}
            name={product.name}
            description={product.tagline}
            reviewsCount={product.reviews}
            viewsCount={product.views}
            votesCount={product.upvotes}
          />
        ))}
      </div>
      <ProductPagination totalPages={loaderData.totalPages} />
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
