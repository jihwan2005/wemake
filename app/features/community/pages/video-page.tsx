import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/video-page";
import { getVideoById } from "../queries";
import InputPair from "~/common/components/input-pair";
import { Form, redirect, useNavigate } from "react-router";
import { Label } from "~/common/components/ui/label";
import { Input } from "~/common/components/ui/input";
import { useState } from "react";
import { Button } from "~/common/components/ui/button";
import { getLoggedInUserId } from "~/features/users/queries";
import { updateVideoInfo, updateVideoThumbnail } from "../mutations";
import { z } from "zod";
import { useNavigation } from "react-router";
import { LoaderCircle } from "lucide-react";
import { deleteVideo } from "../mutations";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "~/common/components/ui/dialog";
export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const { client } = makeSSRClient(request);
  const video = await getVideoById(client, { id: params.videoId });
  return { video };
};

const formSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export const action = async ({ request, params }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const videoId = params.videoId;
  const formData = await request.formData();
  const actionType = formData.get("delete");

  if (String(actionType) === "delete") {
    try {
      const { data: videoData } = await client
        .from("videos")
        .select("video_url, video_thumbnail")
        .eq("video_id", Number(videoId))
        .single();

      await deleteVideo(client, {
        videoId,
        videoUrl: videoData!.video_url,
        thumbnailUrl: videoData!.video_thumbnail ?? "",
      });
      return redirect("/community/videos");
    } catch (error) {
      return { formErrors: { delete: ["Failed to delete video"] } };
    }
  }

  // 🔵 제목 & 설명 유효성 검사
  const { success, error, data } = formSchema.safeParse(
    Object.fromEntries(formData)
  );

  if (!success) {
    return { formErrors: error.flatten().fieldErrors };
  }

  const { title, description } = data;
  const thumbnail = formData.get("thumbnail") as File;
  let newThumbnailUrl = null;

  // 🔵 기존 썸네일 URL 가져오기
  const { data: videoData, error: videoError } = await client
    .from("videos")
    .select("video_thumbnail")
    .eq("video_id", Number(videoId))
    .single();

  if (videoError) {
    return { formErrors: { general: ["Failed to fetch video data"] } };
  }

  const oldThumbnailUrl = videoData?.video_thumbnail;

  // 🟢 썸네일 변경 처리
  if (thumbnail && thumbnail instanceof File && thumbnail.size > 0) {
    if (oldThumbnailUrl) {
      // 기존 썸네일 삭제
      const fileName = oldThumbnailUrl.split("/").pop();
      await client.storage.from("thumbnail").remove([`${userId}/${fileName}`]);
    }

    // 새로운 썸네일 업로드
    const filePath = `${userId}/${Date.now()}`;
    const { error: uploadError } = await client.storage
      .from("thumbnail")
      .upload(filePath, thumbnail, { contentType: thumbnail.type });

    if (uploadError) {
      return { formErrors: { thumbnail: ["Failed to upload thumbnail"] } };
    }

    // 새 썸네일 URL 가져오기
    const { data: urlData } = await client.storage
      .from("thumbnail")
      .getPublicUrl(filePath);
    newThumbnailUrl = urlData.publicUrl;
  }

  // 🔵 영상 정보 업데이트 (title & description)
  await updateVideoInfo(client, { id: videoId, title, description });

  // 🟢 썸네일이 변경된 경우에만 업데이트 실행
  if (newThumbnailUrl) {
    await updateVideoThumbnail(client, {
      id: videoId,
      videoThumbnail: newThumbnailUrl,
    });
  }

  return redirect("/community/videos");
};

export default function VideoPage({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const [thumbnail, setThumbnail] = useState<string | null>(
    loaderData.video.video_thumbnail
  );
  const onChangeThumbnail = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      setThumbnail(URL.createObjectURL(file));
    }
  };
  const navigation = useNavigation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isSubmitting =
    navigation.state === "submitting" || navigation.state === "loading";
  return (
    <div className="grid grid-cols-3 gap-5">
      <Form
        className="flex flex-col gap-5 w-2/3 p-6 rounded-lg border shadow-md"
        method="post"
        encType="multipart/form-data"
      >
        {/* Title Input */}
        <InputPair
          label="title"
          description="Title of Video"
          required
          id="title"
          name="title"
          placeholder="John Doe"
          defaultValue={loaderData.video.title}
        />

        {/* Description Input */}
        <InputPair
          label="description"
          description="Description of Video"
          required
          id="description"
          name="description"
          placeholder="John Doe"
          defaultValue={loaderData.video.description}
        />

        {/* Thumbnail Input */}
        <Label className="flex flex-col gap-1 mb-5">
          Thumbnail
          <small className="text-muted-foreground">
            This is your thumbnail.
          </small>
        </Label>
        <div className="space-y-5">
          <div className="size-40 shadow-xl overflow-hidden">
            {thumbnail ? (
              <img src={thumbnail} className="object-cover w-full h-full" />
            ) : null}
          </div>
          <Input
            id="thumbnail"
            type="file"
            className="w-1/2"
            onChange={onChangeThumbnail}
            name="thumbnail"
          />
        </div>

        {/* Submit Button */}
        <Button className="w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            "수정하기"
          )}
        </Button>
      </Form>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger>
          <Button onClick={() => setIsDialogOpen(true)}>영상 삭제하기</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>영상 삭제하기</DialogTitle>
          <DialogDescription>영상을 정말 삭제하시겠습니까?</DialogDescription>
          <DialogFooter>
            <Button type="submit" onClick={() => setIsDialogOpen(false)}>
              취소하기
            </Button>
            <Form method="post">
              <Button
                id="delete"
                className="bg-primary"
                type="submit"
                name="delete"
                value="delete"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  "영상 삭제"
                )}
              </Button>
            </Form>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
