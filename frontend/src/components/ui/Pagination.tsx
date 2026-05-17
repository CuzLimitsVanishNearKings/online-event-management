import React from 'react';
import Button from './Button';
import { ChevronLeft, ChevronRight } from '../icons';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onNext: () => void;
  onPrevious: () => void;
  onPageSelect?: (page: number) => void;
  startIndex?: number;
  endIndex?: number;
  totalItems?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onNext,
  onPrevious,
  startIndex,
  endIndex,
  totalItems,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-border">
      <div className="text-sm font-medium text-text-muted">
        {totalItems !== undefined && startIndex !== undefined && endIndex !== undefined ? (
          <>
            Showing <span className="font-bold text-text-primary">{startIndex + 1}</span> to{' '}
            <span className="font-bold text-text-primary">{endIndex}</span> of{' '}
            <span className="font-bold text-text-primary">{totalItems}</span> results
          </>
        ) : (
          <>Page {currentPage} of {totalPages}</>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevious}
          disabled={currentPage === 1}
          className="rounded-xl font-bold uppercase tracking-widest text-xs px-4"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Prev
        </Button>
        <div className="flex items-center gap-1 px-2">
          <span className="text-sm font-bold text-text-primary">{currentPage}</span>
          <span className="text-sm text-text-muted">/</span>
          <span className="text-sm text-text-muted">{totalPages}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={currentPage === totalPages}
          className="rounded-xl font-bold uppercase tracking-widest text-xs px-4"
        >
          Next <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
