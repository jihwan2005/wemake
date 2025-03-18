import { ChevronRightIcon, StarIcon } from "lucide-react";
import { NavLink, Outlet } from "react-router";
import { Button, buttonVariants } from "~/common/components/ui/button";
import { cn } from "~/lib/utils";
import type { Route } from "./+types/product-overview-layout";
import { getProductById } from "../queries";
import { makeSSRClient } from "~/supa-client";
export const meta: Route.MetaFunction = ({ data }: Route.MetaArgs) => {
  return [
    { title: `${data.product.name} | wemake` },
    { name: "description", content: "View" },
  ];
};

export const loader = async ({
  params,
  request,
}: Route.LoaderArgs & { params: { productId: string } }) => {
  const { client } = makeSSRClient(request);
  const product = await getProductById(client, {
    productId: params.productId,
  });
  return { product };
};

export default function ProductOverviewLayout({
  loaderData,
}: Route.ComponentProps) {
  return (
    <div className="space-y-10">
      <div className="flex justify-between">
        <div className="flex gap-10">
          <div className="size-40 rounded-xl overflow-hidden shadow-1 bg-primary/50">
            <img
              src={loaderData.product.icon}
              alt={loaderData.product.name}
              className="size-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-5xl font-bold">{loaderData.product.name}</h1>
            <p className="text-2xl font-light">{loaderData.product.tagline}</p>
            <div className="mt-5 flex items-center gap-2">
              <div className="flex text-yellow-500">
                {Array.from({ length: 5 }).map((_, index) => (
                  <StarIcon
                    key={index}
                    className="size-4"
                    fill={
                      index < Math.floor(loaderData.product.average_rating)
                        ? "currentColor"
                        : "none"
                    }
                  />
                ))}
              </div>
              <span className="text-muted-foreground">
                {loaderData.product.reviews} reviews
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-5">
          <Button variant="secondary" size="lg" className="text-lg h-14 px-10">
            Visit Website
          </Button>
          <Button variant="secondary" size="lg" className="text-lg h-14 px-10">
            <ChevronRightIcon className="size-4" />
            Upvote ({loaderData.product.upvotes})
          </Button>
        </div>
      </div>
      <div className="flex gap-2.5">
        <NavLink
          end
          to={`/products/${loaderData.product.product_id}/overview`}
          className={({ isActive }) =>
            cn([
              buttonVariants({ variant: "outline" }),
              isActive && "bg-accent text-foreground",
            ])
          }
        >
          Overview
        </NavLink>
        <NavLink
          to={`/products/${loaderData.product.product_id}/reviews`}
          className={({ isActive }) =>
            cn([
              buttonVariants({ variant: "outline" }),
              isActive && "bg-accent text-foreground",
            ])
          }
        >
          Reviews
        </NavLink>
      </div>
      <div>
        <Outlet
          context={{
            product_id: loaderData.product.product_id,
            description: loaderData.product.description,
            how_it_works: loaderData.product.how_it_works,
            reviews_count: loaderData.product.reviews,
          }}
        />
      </div>
    </div>
  );
}
