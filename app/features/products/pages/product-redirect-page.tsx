import type { Route } from "./+types/product-redirect-page";
import { redirect } from "react-router";

export const loader = ({ params }: Route.LoaderArgs) => {
  return redirect(`/products/${params.productId}/overview`);
};
