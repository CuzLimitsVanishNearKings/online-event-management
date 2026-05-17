import { useState, useMemo } from 'react';

export function usePagination<T>(data: T[], itemsPerPage: number = 10) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil((data?.length || 0) / itemsPerPage));

  // Ensure current page is within bounds if data changes
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedData = useMemo(() => {
    const startIndex = (safePage - 1) * itemsPerPage;
    return (data || []).slice(startIndex, startIndex + itemsPerPage);
  }, [data, safePage, itemsPerPage]);

  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToPage = (pageNumber: number) => setCurrentPage(Math.min(Math.max(1, pageNumber), totalPages));

  return {
    currentPage: safePage,
    totalPages,
    paginatedData,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    startIndex: (safePage - 1) * itemsPerPage,
    endIndex: Math.min(safePage * itemsPerPage, data?.length || 0),
    totalItems: data?.length || 0,
  };
}
