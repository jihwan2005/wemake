// hooks/useSuccessAlert.ts
import { useEffect } from "react";

export function useSuccessAlert({
  actionData,
  current,
  setItems,
}: {
  actionData: any;
  current: number;
  setItems: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  useEffect(() => {
    if (actionData?.success) {
      alert(actionData.message);

      if (actionData.questionId) {
        setItems((prevItems) => {
          const newItems = [...prevItems];
          newItems[current - 1].questionId = actionData.questionId;
          return newItems;
        });
      }
    }
  }, [actionData]);
}
