import { ProductCard } from "~/features/products/components/product-card";
import type { Route } from "./+types/profile-products-page";
import { getUserProducts } from "../queries";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Products | wemake" }];
};

export async function loader({ params }: Route.LoaderArgs) {
  const products = await getUserProducts(params.username);
  return { products };
}

export default function ProfileProductsPage({
  loaderData,
}: Route.ComponentProps) {
  return (
    <div className="flex flex-col gap-5">
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
  );
}
