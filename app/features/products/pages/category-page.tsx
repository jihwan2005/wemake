import { Hero } from "~/common/components/hero";
import { ProductCard } from "../components/product-card";
import ProductPagination from "~/common/components/product-pagination";
import type { Route } from "./+types/category-page";
import {
  getCategory,
  getProductsByCategory,
  getCategoryPages,
} from "../queries";
import { z } from "zod";

export const meta: Route.MetaFunction = ({ params }) => {
  return [
    { title: `${params.category} | ProductHunt Clone` },
    { name: "description", content: `Browse ${params.category} products` },
  ];
};

const paramsSchema = z.object({
  category: z.coerce.number(),
});

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") || 1;
  const { success, data: parsedData } = paramsSchema.safeParse(params);
  if (!success) {
    throw new Response("Invalid category", { status: 400 });
  }
  const category = await getCategory(parsedData.category);
  const products = await getProductsByCategory({
    categoryId: parsedData.category,
    page: Number(page),
  });
  const totalPages = await getCategoryPages(parsedData.category);
  return { products, category, totalPages };
};

export default function CategoryPage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="space-y-20">
      <Hero
        title={loaderData.category.name}
        subtitle={loaderData.category.description}
      />
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
