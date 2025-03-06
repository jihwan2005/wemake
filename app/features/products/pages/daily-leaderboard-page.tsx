import * as React from "react";
import { DateTime } from "luxon";
import type { Route } from "./+types/daily-leaderboard-page";
import { z } from "zod";
import { Hero } from "~/common/components/hero";
import { ProductCard } from "../components/product-card";
import { useNavigate } from "react-router";
import ProductPagination from "~/common/components/product-pagination";
import "react-datepicker/dist/react-datepicker.css";

const paramsSchema = z.object({
  year: z.coerce.number(),
  month: z.coerce.number(),
  day: z.coerce.number(),
});

export const loader = async ({ params }: Route.LoaderArgs) => {
  const { success, data: parsedData } = paramsSchema.safeParse(params);
  if (!success) {
    throw new Response("Invalid date", { status: 400 });
  }

  const date = DateTime.fromObject(parsedData)
    .setZone("Asia/Seoul")
    .startOf("day");

  if (!date.isValid) {
    throw new Error("Invalid date");
  }
  const today = DateTime.now().setZone("Asia/Seoul").startOf("day");
  if (date > today) {
    throw new Error("Date is in the future");
  }

  return {
    ...parsedData,
  };
};

export const meta: Route.MetaFunction = ({ params }) => {
  const { success, data: parsedData } = paramsSchema.safeParse(params);
  let title = "Monthly Leaderboard";
  if (success) {
    title = `Best of ${parsedData.year}/${parsedData.month}`;
  }
  return [{ title: `${title} | wmake` }];
};

export default function DailyLeaderboardPage({
  loaderData,
}: Route.ComponentProps) {
  const navigate = useNavigate();
  const urlDate = DateTime.fromObject(loaderData);
  const today = DateTime.now().setZone("Asia/Seoul").startOf("day");

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    let newYear = urlDate.year;
    let newMonth = urlDate.month;
    let newDay = urlDate.day;

    if (name === "year") {
      newYear = Number(value);
    } else if (name === "month") {
      newMonth = Number(value);
    } else if (name === "day") {
      newDay = Number(value);
    }

    // 선택한 날짜가 현재(today)보다 미래이면, today로 조정
    const selectedDate = DateTime.local(newYear, newMonth, newDay);
    if (selectedDate > today) {
      newYear = today.year;
      newMonth = today.month;
      newDay = today.day;
    }

    navigate(`/products/leaderboards/daily/${newYear}/${newMonth}/${newDay}`);
  };

  const currentYear = today.year;
  const selectedYear = urlDate.year;

  // 선택된 연도에 따라 월(month) 제한
  const months =
    selectedYear === currentYear
      ? Array.from({ length: today.month }, (_, i) => i + 1)
      : Array.from({ length: 12 }, (_, i) => i + 1);

  // 선택된 연도와 월에 따라 일(day) 제한
  const daysInMonth =
    DateTime.local(selectedYear, urlDate.month).daysInMonth ?? 31;
  const maxDays = (
    selectedYear === currentYear && urlDate.month === today.month
      ? today.day
      : daysInMonth
  ) as number;

  const days = Array.from({ length: maxDays }, (_, i) => i + 1);

  return (
    <div>
      <Hero
        title={`Best of ${urlDate.toLocaleString({
          month: "long",
          year: "numeric",
          day: "numeric",
        })}`}
      />
      <div className="flex gap-2 items-center justify-center pb-10">
        <select
          name="year"
          value={urlDate.year}
          onChange={handleSelectChange}
          className="px-4 py-2 border rounded-md w-28 h-9 bg-black text-white"
        >
          {Array.from(
            { length: currentYear - 1999 },
            (_, i) => currentYear - i
          ).map((year) => (
            <option key={year} value={year} className="bg-white text-black">
              {year}년
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
              {DateTime.fromObject({ month }).toFormat("MMMM")}
            </option>
          ))}
        </select>

        <select
          name="day"
          value={urlDate.day}
          onChange={handleSelectChange}
          className="px-4 py-2 border rounded-md w-24 h-9 bg-black text-white"
        >
          {days.map((day) => (
            <option key={day} value={day} className="bg-white text-black">
              {day}일
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-5 w-full max-w-screen-md mx-auto pb-10">
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
