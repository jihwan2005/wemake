import { StarIcon } from "lucide-react";
import { useState } from "react";
import { Form } from "react-router";
import InputPair from "~/common/components/input-pair";
import { Button } from "~/common/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/common/components/ui/dialog";
import { Label } from "~/common/components/ui/label";

export default function CreateReviewDialog() {
  const [rating, setRating] = useState<number>(0);
  const [hoverStar, setHoverStar] = useState<number>(0);
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-2xl">Write a review</DialogTitle>
        <DialogDescription>write a review for the product.</DialogDescription>
      </DialogHeader>
      <Form className="space-y-10">
        <div>
          <Label className="flex flex-col gap-1">
            Rating
            <small className="text-muted-foreground">Rate this product</small>
          </Label>
          <div className="flex gap-2 mt-5">
            {[1, 2, 3, 4, 5].map((star) => (
              <label
                key={star}
                className="relative"
                onMouseEnter={() => setHoverStar(star)}
                onMouseLeave={() => setHoverStar(0)}
              >
                <StarIcon
                  className="size-5 text-yellow-500"
                  fill={
                    hoverStar >= star || rating >= star ? "currentColor" : ""
                  }
                />
                <input
                  type="radio"
                  name="rating"
                  value={star}
                  required
                  className="opacity-0 h-px w-px absolute"
                  onChange={(e) => setRating(star)}
                />
              </label>
            ))}
          </div>
        </div>
        <InputPair
          textArea
          label="Review"
          description="Maximum 1000 characters"
          placeholder="Write a review for the product."
          required
        />
        <DialogFooter>
          <Button type="submit">Submit</Button>
        </DialogFooter>
      </Form>
    </DialogContent>
  );
}
