import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "~/common/components/ui/carousel";
import type { Video } from "../queries";
import { openModal } from "~/store/modalSlice";
import * as motion from "motion/react-client";

export const CarouselGroup = ({ videos }: { videos: Video[] }) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <>
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {videos.map((video) => (
            <CarouselItem key={video.video_id} className="relative">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ stiffness: 300 }}
                className="relative cursor-pointer"
                onClick={() => dispatch(openModal(video))}
              >
                {video.video_thumbnail && (
                  <img
                    src={video.video_thumbnail}
                    className="w-full h-full absolute"
                  />
                )}
                <video className="w-full cursor-pointer">
                  <source src={video.video_url} type="video/mp4" />
                </video>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="py-2 text-center text-sm text-muted-foreground">
        Slide {current} of {count}
      </div>
    </>
  );
};
