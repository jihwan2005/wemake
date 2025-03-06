import { Hero } from "~/common/components/hero";
import { ProductCard } from "../components/product-card";
import ProductPagination from "~/common/components/product-pagination";
import type { Route } from "./+types/category-page";

export const meta: Route.MetaFunction = ({ params }) => {
  return [
    { title: `${params.category} | ProductHunt Clone` },
    { name: "description", content: `Browse ${params.category} products` },
  ];
};

export default function CategoryPage() {
  return (
    <div className="space-y-20">
      <Hero
        title={"Developer Tools"}
        subtitle={`Tools for developers to build products faster`}
      />
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
