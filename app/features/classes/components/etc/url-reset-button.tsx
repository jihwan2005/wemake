import { RotateCcw } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "~/common/components/ui/button";

export default function UrlResetButton() {
  const navigate = useNavigate();
  const resetUrl = () => {
    navigate("/classes");
  };
  return (
    <Button onClick={resetUrl}>
      <RotateCcw className="size-4" />
    </Button>
  );
}
