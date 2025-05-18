import { Plus } from "lucide-react";
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
import type { Route } from "./+types/class-mindmaps-page";
import { makeSSRClient } from "~/supa-client";
import { getLoggedInUserId } from "~/features/users/queries";
import {
  getClassMindMaps,
  getClassMindMapThumbnailById,
} from "../../data/queries";
import { Form, Link, redirect } from "react-router";
import { createClassMindMap } from "../../data/mutations";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/common/components/ui/popover";

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { client } = await makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const classId = params.classId;
  const mindmaps = await getClassMindMaps(client, {
    classId,
    userId,
  });
  return { mindmaps, classId };
};

export const action = async ({ request, params }: Route.ActionArgs) => {
  const { client } = await makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const classId = params.classId;
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const mindmap = await createClassMindMap(client, {
    userId,
    classId,
    title,
  });
  return redirect(`/classes/${classId}/mindmaps/${mindmap.mindmap_id}`);
};

export default function ClassMindMapsPage({
  loaderData,
}: Route.ComponentProps) {
  return (
    <div className="space-y-20">
      <Hero title="MindMap" subtitle="Make mindmap and expand your ideas" />
      <div className="mx-20">
        <div className="grid grid-cols-7 gap-9">
          {/* Dialog 트리거도 grid 안에 포함 */}
          <Dialog>
            <DialogTrigger asChild>
              <div className="flex flex-col items-center gap-2">
                <button className="w-[180px] h-[120px] border-2 border-dashed border-blue-500 flex items-center justify-center rounded-md cursor-pointer">
                  <Plus className="size-4 text-blue-600" />
                </button>
                <span className="text-blue-500">새로 만들기</span>
              </div>
            </DialogTrigger>
            <DialogContent>
              <Form method="post">
                <DialogHeader className="mb-5">
                  <DialogTitle>새 마인드맵 만들기</DialogTitle>
                </DialogHeader>
                <Input
                  placeholder="마인드맵 이름 입력"
                  className="mb-5"
                  name="title"
                />
                <DialogFooter>
                  <Button>생성하기</Button>
                </DialogFooter>
              </Form>
            </DialogContent>
          </Dialog>

          {loaderData.mindmaps.map((mindmap) => (
            <div className="flex flex-col items-center gap-2">
              <Link
                to={`/classes/${loaderData.classId}/mindmaps/${mindmap.mindmap_id}`}
              >
                <div
                  className="w-[180px] h-[120px] border rounded-md p-4 flex items-center justify-center cursor-pointer"
                  style={{
                    backgroundImage: mindmap.class_mindmap_thumbnail
                      ?.thumbnail_base64
                      ? `url(${mindmap.class_mindmap_thumbnail.thumbnail_base64})`
                      : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              </Link>
              <Popover>
                <PopoverTrigger>
                  <span className="cursor-pointer hover:underline transition-all">
                    {mindmap.mindmap_title}
                  </span>
                </PopoverTrigger>
                <PopoverContent></PopoverContent>
              </Popover>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
