import { ChevronRightIcon, StarIcon } from "lucide-react";
import type { Route } from "./+types/product-overview-page";
import { Button } from "~/common/components/ui/button";
import { Link } from "react-router";

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
      <div className="flex justify-between">
        <div className="flex gap-10">
          <div className="size-40 rounded-xl shadow-1 bg-primary/50"></div>
          <div>
            <h1 className="text-5xl font-bold">Product Name</h1>
            <p className="text-2xl font-light">Product Description</p>
            <div className="mt-5 flex items-center gap-2">
              <div className="flex text-yellow-500">
                {Array.from({ length: 5 }).map((_, index) => (
                  <StarIcon
                    key={index}
                    className="size-4"
                    fill="currentColor"
                  />
                ))}
              </div>
              <span className="text-muted-foreground">100 reviews</span>
            </div>
          </div>
        </div>
        <div className="flex gap-5">
          <Button variant="secondary" size="lg" className="text-lg h-14 px-10">
            Visit Website
          </Button>
          <Button variant="secondary" size="lg" className="text-lg h-14 px-10">
            <ChevronRightIcon className="size-4" />
            Upvote (100)
          </Button>
        </div>
      </div>
      <div className="flex gap-2.5">
        <Button variant="outline" asChild>
          <Link to={`/products/${productId}/overview`}>Overview</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to={`/products/${productId}/reviews`}>Reviews</Link>
        </Button>
      </div>
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
    </div>
  );
}
