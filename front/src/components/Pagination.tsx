import React, { useState } from "react";
import { PaginationModel } from "./PaginationModel";
import GenericDropdown from "./GenericDropdown.tsx";

export function Pagination({
  _page,
  totalCount,
  onPageChanged,
  className,
}: {
  _page: PaginationModel;
  totalCount: number;
  onPageChanged: (page: number) => void;
  className?: any;
}) {
  const [page, setPage] = useState<PaginationModel>(_page);

  const pageNumbers: number = Math.ceil(totalCount / (_page.pageSize || 1));

  function onClick(e: React.MouseEvent<HTMLAnchorElement>, newPage: number) {
    if (newPage <= pageNumbers - 1 && newPage > -1) {
      e.preventDefault();
      setPage({ ...page, pageIndex: newPage });
      onPageChanged(newPage);
    }
  }

  return (
    <div className={"" + className}>
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <a
            href="#"
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            onClick={(e) => onClick(e, page.pageIndex - 1)}
          >
            Previous
          </a>
          <a
            href="#"
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            onClick={(e) => onClick(e, page.pageIndex + 1)}
          >
            Next
          </a>
        </div>

        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <a
                href="#"
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                onClick={(e) => onClick(e, page.pageIndex - 1)}
              >
                <span className="sr-only">Previous</span>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>

              <a
                href="#"
                aria-current="page"
                className="relative z-10 inline-flex items-center bg-gray-400 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={(e) => onClick(e, page.pageIndex)}
              >
                {page.pageIndex}
              </a>
              {page.pageIndex === pageNumbers - 1 ? (
                ""
              ) : (
                <>
                  <a
                    href="#"
                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    onClick={(e) => onClick(e, page.pageIndex + 1)}
                  >
                    {page.pageIndex + 1 < pageNumbers - 1
                      ? page.pageIndex + 1
                      : pageNumbers - 1}
                  </a>
                </>
              )}
              {pageNumbers - 2 <= page.pageIndex ? (
                ""
              ) : (
                <>
                  <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                    ...
                  </span>
                  <a
                    href="#"
                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    onClick={(e) => onClick(e, pageNumbers - 1)}
                  >
                    {pageNumbers - 1}
                  </a>
                </>
              )}

              <a
                href="#"
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                onClick={(e) => onClick(e, page.pageIndex + 1)}
              >
                <span className="sr-only">Next</span>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
