import type { Route } from "~/+types/routes";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [
    { title: "Products | ProductHunt Clone" },
    { name: "description", content: "Browse all products" },
  ];
};

export function loader({ request }: Route.LoaderArgs) {
  return {
    products: [], // Add products fetch logic
  };
}

export default function ProductsPage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      {/* Add products grid */}
    </div>
  );
}
