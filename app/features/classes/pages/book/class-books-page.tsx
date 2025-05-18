import { Plus } from "lucide-react";
import { Form, Link, redirect } from "react-router";
import { Hero } from "~/common/components/hero";
import { Button } from "~/common/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/common/components/ui/dialog";
import { Input } from "~/common/components/ui/input";
import { getLoggedInUserId } from "~/features/users/queries";
import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/class-books-page";
import { createClassBook, createClassBookCover } from "../../data/mutations";
import { getClassBooks } from "../../data/queries";

export const action = async ({ request, params }: Route.ActionArgs) => {
  const { client } = await makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const classId = params.classId;
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const cover = formData.get("cover") as string;
  const { book_id } = await createClassBook(client, {
    userId,
    classId,
    title,
  });
  await createClassBookCover(client, {
    bookId: book_id,
    cover,
  });
  return redirect(`/classes/${classId}/books/${book_id}`);
};

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { client } = await makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const classId = params.classId;
  const books = await getClassBooks(client, {
    userId,
    classId,
  });
  return { books, classId };
};

export default function ClassBooksPage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="space-y-20">
      <Hero title="The book Is the blueprint for life." />
      <div className="mx-20">
        <div className="grid grid-cols-7 gap-9">
          <Dialog>
            <DialogTrigger>
              <div className="flex flex-col items-center gap-2">
                <button className="w-[120px] h-[170px] border-2 border-dashed border-blue-500 flex items-center justify-center cursor-pointer">
                  <Plus className="size-4 text-blue-600" />
                </button>
                <span className="text-blue-500">책 추가하기</span>
              </div>
            </DialogTrigger>
            <DialogContent>
              <Form method="post">
                <DialogHeader className="mb-5">
                  <DialogTitle>책 정보 입력하기</DialogTitle>
                </DialogHeader>
                <Input placeholder="책 제목" className="mb-5" name="title" />
                <Input
                  placeholder="책 표지(이미지 주소를 입력)(선택)"
                  className="mb-5"
                  name="cover"
                />
                <DialogFooter>
                  <Button>저장하기</Button>
                </DialogFooter>
              </Form>
            </DialogContent>
          </Dialog>
          {loaderData.books.map((book) => (
            <div
              className="flex flex-col items-center gap-2"
              key={book.book_id}
            >
              <Link to={`/classes/${loaderData.classId}/books/${book.book_id}`}>
                <div
                  className="w-[120px] h-[170px] border p-4 flex items-center justify-center cursor-pointer"
                  style={{
                    backgroundImage: book.class_book_cover?.cover_base64
                      ? `url(${book.class_book_cover.cover_base64})`
                      : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              </Link>
              <span>{book.book_title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
