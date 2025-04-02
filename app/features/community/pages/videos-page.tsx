import { LoaderCircle } from "lucide-react";
import { Form, useNavigation } from "react-router";
import { Hero } from "~/common/components/hero";
import { Button } from "~/common/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/common/components/ui/dialog";
import { Input } from "~/common/components/ui/input";
import { Label } from "~/common/components/ui/label";
import type { Route } from "./+types/videos-page";
import { makeSSRClient } from "~/supa-client";
import { getLoggedInUserId } from "~/features/users/queries";
import { createVideo } from "../mutations";
import { getVideos } from "../queries";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "~/common/components/ui/carousel";
import { groupVideosByAuthor } from "../queries";
import { useDispatch } from "react-redux";
import { openModal } from "~/store/modalSlice";
import Modal from "../components/Modal";
import { useState } from "react";

export const action = async ({ request }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const videoUrl = formData.get("video") as File;
  const thumbnail = formData.get("thumbnail") as File;
  const filePath = `${userId}/${Date.now()}`;
  const { data, error } = await client.storage
    .from("videos")
    .upload(filePath, videoUrl, {
      contentType: "video/mp4",
    });
  const { data: thumbnailData, error: thumbnailError } = await client.storage
    .from("thumbnail")
    .upload(filePath, thumbnail, {
      contentType: thumbnail.type,
    });
  if (error) {
    console.log(error);
    return { ok: false, error: "비디오 업로드 실패" };
  }
  if (thumbnailError) {
    console.log(error);
    return { ok: false, error: "썸네일 업로드 실패" };
  }
  const {
    data: { publicUrl },
  } = client.storage.from("videos").getPublicUrl(filePath);
  const {
    data: { publicUrl: thumbnailUrl },
  } = client.storage.from("thumbnail").getPublicUrl(filePath);
  await createVideo(client, {
    title,
    description,
    videoUrl: publicUrl,
    userId,
    thumbnail: thumbnailUrl,
  });
  return {
    ok: true,
  };
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const { client } = makeSSRClient(request);
  const videos = await getVideos(client);
  const groupedVideos = groupVideosByAuthor(videos);
  return { groupedVideos };
};

export default function VideosPage({ loaderData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting =
    navigation.state === "submitting" || navigation.state === "loading";
  const dispatch = useDispatch();
  return (
    <div className="space-y-20">
      <Hero title="Videos" subtitle="Upload your videos" />
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">영상 올리기</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <Form method="post" encType="multipart/form-data">
            <DialogHeader>
              <DialogTitle>영상 업로드</DialogTitle>
              <DialogDescription>
                영상에 대한 정보를 작성해주세요
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-5 m-5">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  제목
                </Label>
                <Input id="title" className="col-span-3" name="title" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  설명
                </Label>
                <Input
                  id="description"
                  className="col-span-3"
                  name="description"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="video" className="text-right">
                  영상 가져오기
                </Label>
                <Input
                  id="video"
                  className="col-span-3"
                  name="video"
                  type="file"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="thumbnail" className="text-right">
                  썸네일 가져오기
                </Label>
                <Input
                  id="thumbnail"
                  className="col-span-3"
                  name="thumbnail"
                  type="file"
                />
              </div>
            </div>
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                "Submit Vote"
              )}
            </Button>
          </Form>
        </DialogContent>
      </Dialog>
      <div className="grid grid-cols-4 gap-4">
        {Object.entries(loaderData.groupedVideos).map(([author, videos]) => (
          <div key={author} className="space-y-4">
            <h2 className="text-lg font-semibold">{author}님의 영상</h2>
            <Carousel className="w-full">
              <CarouselContent>
                {videos.map((video) => (
                  <CarouselItem key={video.video_id} className="relative">
                    <div
                      className="relative cursor-pointer"
                      onClick={() => dispatch(openModal(video))}
                    >
                      {video.video_thumbnail && (
                        <img
                          src={video.video_thumbnail}
                          className="w-full h-full object-cover rounded-lg absolute"
                        />
                      )}
                      <video className="w-full cursor-pointer">
                        <source src={video.video_url} type="video/mp4" />
                      </video>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        ))}
      </div>
      <Modal />
    </div>
  );
}
