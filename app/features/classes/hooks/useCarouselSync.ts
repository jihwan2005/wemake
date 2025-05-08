// hooks/useCarouselSync.ts
import { useEffect } from "react";

export function useCarouselSync(api: any, setCount: any, setCurrent: any) {
  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);
}
