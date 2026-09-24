"use client";

type PaginationProps = {
  page: number;
  totalPages: number;
  pageSize: number;
  startItem: number;
  endItem: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

export default function Pagination({
  page,
  totalPages,
  pageSize,
  startItem,
  endItem,
  total,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">

      {/* Showing text */}
      <p className="text-sm text-gray-600">
        Showing {startItem}–{endItem} of {total}
      </p>

      <div className="flex items-center gap-2">

        {/* Previous */}
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-lg border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40 hover:bg-gray-100"
        >
          Previous
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {Array.from(
            { length: totalPages },
            (_, index) => index + 1
          ).map((pageNumber) => (
            <button
              key={pageNumber}
              disabled={page === pageNumber}
              onClick={() => onPageChange(pageNumber)}
              className={`rounded-lg border px-3 py-2 text-sm ${
                page === pageNumber
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {pageNumber}
            </button>
          ))}
        </div>

        {/* Next */}
        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-lg border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40 hover:bg-gray-100"
        >
          Next
        </button>

        {/* Page size */}
        <select
          value={pageSize}
          onChange={(e) =>
            onPageSizeChange(Number(e.target.value))
          }
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>

      </div>
    </div>
  );
}