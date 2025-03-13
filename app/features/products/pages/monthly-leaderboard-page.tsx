import { DateTime } from "luxon";
import { data, isRouteErrorResponse, Link, useNavigate } from "react-router";
import { z } from "zod";
import { Hero } from "~/common/components/hero";
import { ProductCard } from "../components/product-card";
import { Button } from "~/common/components/ui/button";
import ProductPagination from "~/common/components/product-pagination";
import type { Route } from "./+types/monthly-leaderboard-page";
import { getProductsByDateRange, getProductPagesByDateRange } from "../queries";

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

export const loader = async ({ params, request }: Route.LoaderArgs) => {
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
  const url = new URL(request.url);

  const products = await getProductsByDateRange({
    startDate: date.startOf("month"),
    endDate: date.endOf("month"),
    limit: 15,
  });
  const totalPages = await getProductPagesByDateRange({
    startDate: date.startOf("month"),
    endDate: date.endOf("month"),
  });
  return {
    products,
    totalPages,
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
