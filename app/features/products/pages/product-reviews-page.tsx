import type { Route } from "./+types/product-reviews-page.types";

interface ProductReviewsPageProps extends Route.ComponentProps {}

export function ProductReviewsPage({ loaderData }: ProductReviewsPageProps) {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Product Reviews</h1>
      {/* Add your product reviews content here */}
    </div>
  );
}

export function loader({ params }: Route.LoaderArgs) {
  return {
    productId: params.productId,
  };
}

export function meta({ params }: Route.MetaFunction) {
  return [
    { title: `Reviews for Product ${params.productId}` },
    { name: "description", content: `Reviews for product ${params.productId}` },
  ];
}
