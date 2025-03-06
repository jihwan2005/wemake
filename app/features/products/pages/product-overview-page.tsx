import type { Route } from "./+types/product-overview-page";

export const meta: Route.MetaFunction = ({ params }) => {
  return [
    { title: `Product ${params.productId} Overview` },
    { name: "description", content: `Overview of product ${params.productId}` },
  ];
};

export function ProductOverviewPage({
  params: { productId },
}: Route.ComponentProps) {
  return (
    <div className="space-y-10">
      <div className="space-y-1">
        <h3 className="text-xl font-bold">What is this product?</h3>
        <p className="text-muted-foreground">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
          quos.
        </p>
      </div>
      <div className="space-y-1">
        <h3 className="text-xl font-bold">How does it work?</h3>
        <p className="text-muted-foreground">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
          quos.
        </p>
      </div>
    </div>
  );
}
