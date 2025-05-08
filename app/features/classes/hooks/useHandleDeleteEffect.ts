// hooks/useHandleDeleteEffect.ts
import { useEffect } from "react";

export function useHandleDeleteEffect({
  fetcherData,
  deleteIndex,
  setItems,
  api,
  setCurrent,
  resetDeleteIndex,
}: {
  fetcherData: any;
  deleteIndex: number | null;
  setItems: React.Dispatch<React.SetStateAction<any[]>>;
  api: any;
  setCurrent: (val: number) => void;
  resetDeleteIndex: () => void;
}) {
  useEffect(() => {
    if (fetcherData && deleteIndex !== null) {
      setItems((prevItems) => {
        const newItems = [...prevItems];
        newItems.splice(deleteIndex, 1);
        return newItems;
      });

      setTimeout(() => {
        const newIndex = Math.max(0, deleteIndex - 1);
        api?.scrollTo(newIndex);
        setCurrent(newIndex + 1);
      }, 0);

      resetDeleteIndex();
    }
  }, [fetcherData, deleteIndex]);
}
