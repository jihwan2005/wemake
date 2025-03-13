import { Hero } from "~/common/components/hero";
import { CategoryCard } from "~/features/products/components/category-card";
import type { Route } from "./+types/categories-page";
import { getCategories } from "../queries";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Categories | ProductHunt Clone" },
    { name: "description", content: "Browse products by category" },
  ];
};

export const loader = async () => {
  const categories = await getCategories();
  return { categories };
};

export default function CategoriesPage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="space-y-20">
      <Hero title="Categories" subtitle="Browse products by category" />
      <div className="grid grid-cols-4 gap-10">
        {loaderData.categories.map((category) => (
          <CategoryCard
            key={category.category_id}
            id={category.category_id}
            name={category.name}
            description={category.description}
          />
        ))}
      </div>
    </div>
  );
}
