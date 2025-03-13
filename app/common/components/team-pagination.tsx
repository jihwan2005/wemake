import { useSearchParams } from "react-router";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

interface TeamPaginationProps {
  totalPages: number;
}

export default function TeamPagination({ totalPages }: TeamPaginationProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const onPageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(newPage));
    setSearchParams(params);
  };

  return (
    <div>
      <Pagination>
        <PaginationContent>
          {page > 1 && (
            <>
              <PaginationItem>
                <PaginationPrevious onClick={() => onPageChange(page - 1)} />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink onClick={() => onPageChange(page - 1)}>
                  {page - 1}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          <PaginationItem>
            <PaginationLink isActive>{page}</PaginationLink>
          </PaginationItem>

          {page < totalPages && (
            <>
              <PaginationItem>
                <PaginationLink onClick={() => onPageChange(page + 1)}>
                  {page + 1}
                </PaginationLink>
              </PaginationItem>
              {page + 1 < totalPages && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationNext onClick={() => onPageChange(page + 1)} />
              </PaginationItem>
            </>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
