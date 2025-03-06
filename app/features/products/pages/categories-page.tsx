import { Hero } from "~/common/components/hero";
import { CategoryCard } from "~/features/products/components/category-card";
import type { Route } from "./+types/categories-page";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Categories | ProductHunt Clone" },
    { name: "description", content: "Browse products by category" },
  ];
};

export default function CategoriesPage() {
  return (
    <div className="space-y-20">
      <Hero title="Categories" subtitle="Browse products by category" />
      <div className="grid grid-cols-4 gap-10">
        {Array.from({ length: 10 }).map((_, index) => (
          <CategoryCard
            key={`categoryId-${index}`}
            id={`categoryId-${index}`}
            name="Category Name"
            description="Category Description"
          />
        ))}
      </div>
    </div>
  );
}
