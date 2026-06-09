import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../utils/cn'

interface PaginationProps {
  currentPage: number
  totalPages: number
  // New API (EventsListPage)
  onPageChange?: (page: number) => void
  // Legacy API (admin / organizer pages)
  onNext?: () => void
  onPrevious?: () => void
  startIndex?: number
  endIndex?: number
  totalItems?: number
  className?: string
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  onNext,
  onPrevious,
  startIndex,
  endIndex,
  totalItems,
  className
}: PaginationProps) => {
  if (totalPages <= 1) return null

  const handlePrev = () => {
    if (onPrevious) onPrevious()
    else if (onPageChange) onPageChange(currentPage - 1)
  }

  const handleNext = () => {
    if (onNext) onNext()
    else if (onPageChange) onPageChange(currentPage + 1)
  }

  const handlePage = (page: number) => {
    if (onPageChange) onPageChange(page)
  }

  // Build visible page numbers with ellipsis
  const getPages = (): (number | '...')[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages: (number | '...')[] = [1]
    if (currentPage > 3) pages.push('...')
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i)
    }
    if (currentPage < totalPages - 2) pages.push('...')
    pages.push(totalPages)
    return pages
  }

  return (
    <div className={cn('flex flex-col sm:flex-row items-center justify-between gap-4 py-4', className)}>
      {/* Item count (legacy API) */}
      {totalItems !== undefined && (
        <p className="text-sm text-text-muted font-medium">
          Showing <span className="font-bold text-text-primary">{(startIndex ?? 0) + 1}–{endIndex ?? 0}</span> of{' '}
          <span className="font-bold text-text-primary">{totalItems}</span>
        </p>
      )}

      <div className="flex items-center gap-2 mx-auto sm:mx-0">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="w-10 h-10 flex items-center justify-center rounded-md border border-border hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Only show number buttons if onPageChange is provided */}
        {onPageChange ? (
          <div className="flex items-center gap-1">
            {getPages().map((page, idx) =>
              page === '...' ? (
                <span key={`el-${idx}`} className="w-10 h-10 flex items-center justify-center text-text-muted text-sm">
                  …
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => handlePage(page as number)}
                  className={cn(
                    'w-10 h-10 rounded-md text-sm font-semibold transition-all',
                    currentPage === page
                      ? 'bg-primary text-white shadow-lg shadow-primary/25'
                      : 'border border-border hover:border-primary hover:text-primary text-text-secondary'
                  )}
                >
                  {page}
                </button>
              )
            )}
          </div>
        ) : (
          <span className="px-4 text-sm font-semibold text-text-primary">
            {currentPage} / {totalPages}
          </span>
        )}

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="w-10 h-10 flex items-center justify-center rounded-md border border-border hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default Pagination
