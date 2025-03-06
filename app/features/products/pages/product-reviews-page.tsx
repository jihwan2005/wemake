import type { Route } from "./+types/product-reviews-page";

export const meta: Route.MetaFunction = ({ params }) => {
  return [
    { title: `Reviews for Product ${params.productId}` },
    { name: "description", content: `Reviews for product ${params.productId}` },
  ];
};

export function ProductReviewsPage() {
  return (
    <div>
      <h1>Review</h1>
    </div>
  );
}
