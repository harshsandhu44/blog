import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

type PostPaginationProps = {
  currentPage: number;
  totalPages: number;
};

function getPageHref(page: number) {
  return page <= 1 ? "/" : `/?page=${page}`;
}

export function PostPagination({ currentPage, totalPages }: PostPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav aria-label="Post pagination" className="mt-6 flex flex-wrap items-center justify-center gap-2">
      {currentPage > 1 ? (
        <Button asChild variant="outline" size="sm">
          <Link href={getPageHref(currentPage - 1)}>
            <ChevronLeft className="size-4" />
            Previous
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled>
          <ChevronLeft className="size-4" />
          Previous
        </Button>
      )}

      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => {
          if (page === currentPage) {
            return (
              <Button key={page} variant="default" size="sm" disabled>
                {page}
              </Button>
            );
          }

          return (
            <Button key={page} asChild variant="outline" size="sm">
              <Link href={getPageHref(page)}>{page}</Link>
            </Button>
          );
        })}
      </div>

      {currentPage < totalPages ? (
        <Button asChild variant="outline" size="sm">
          <Link href={getPageHref(currentPage + 1)}>
            Next
            <ChevronRight className="size-4" />
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled>
          Next
          <ChevronRight className="size-4" />
        </Button>
      )}
    </nav>
  );
}
