import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/class-book-page";
import { getClassBookById } from "../../data/queries";

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { client } = await makeSSRClient(request);
  const bookId = params.bookId;
  const { book_title } = await getClassBookById(client, {
    bookId,
  });
  return { book_title };
};

export default function ClassBooksPage({ loaderData }: Route.ComponentProps) {
  return <div>{loaderData.book_title}</div>;
}
