import { LoaderCircle, Upload } from "lucide-react";
import { useState } from "react";
import { Form, useNavigation } from "react-router";
import { Button } from "~/common/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/common/components/ui/dialog";
import { Input } from "~/common/components/ui/input";

export default function CreateChapterDialog() {
  const [createChapterDialogOpen, setCreateChapterDialogOpen] = useState(false);
  const navigation = useNavigation();
  const isSubmitting =
    navigation.state === "submitting" || navigation.state === "loading";
  return (
    <Dialog
      open={createChapterDialogOpen}
      onOpenChange={setCreateChapterDialogOpen}
    >
      <DialogTrigger asChild>
        <Button onClick={() => setCreateChapterDialogOpen(true)}>
          <Upload className="size-4" />
          Chapter
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-4xl">
        <DialogHeader>
          <DialogTitle>Create Class</DialogTitle>
          <DialogDescription>Wrtie chapter of your class</DialogDescription>
        </DialogHeader>
        <Form method="post" encType="multipart/form-data">
          <input type="hidden" name="actionType" value="create-chapter" />
          <Input id="chapter" name="chapter" />
          <DialogFooter className="mt-5">
            <Button
              type="button"
              onClick={() => setCreateChapterDialogOpen(false)}
            >
              취소하기
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <LoaderCircle className="animate-spin w-5 h-5" />
              ) : (
                "Create Chapter"
              )}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
