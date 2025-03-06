import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";

interface CategoryCardProps {
  id: string;
  name: string;
  description: string;
}

export function CategoryCard({ id, name, description }: CategoryCardProps) {
  return (
    <Link to={`/products/categories/${id}`} className="block">
      <Card>
        <CardHeader>
          <CardTitle className="flex">
            {name} <ChevronRight className="size-6" />
          </CardTitle>
          <CardDescription className="text-base">{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
