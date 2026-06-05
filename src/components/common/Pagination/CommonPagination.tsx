import './CommonPagination.scss';

interface Props {
    currentPage: number;         // 1-based
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    className?: string;
}

const CommonPagination = ({
    currentPage,
    totalItems,
    pageSize,
    onPageChange,
    className = '',
}: Props) => {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

    /* Build visible page numbers with ellipsis */
    const getPageNumbers = (): (number | '...')[] => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        const pages: (number | '...')[] = [1];
        if (currentPage > 3) pages.push('...');
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
        for (let i = start; i <= end; i++) pages.push(i);
        if (currentPage < totalPages - 2) pages.push('...');
        pages.push(totalPages);
        return pages;
    };

    return (
        <div className={`common-pagination ${className}`}>

            {/* Right: page buttons */}
            <div className="common-pagination__pages">
                <button
                    className="pg-btn"
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    aria-label="Previous page"
                >
                    ‹
                </button>

                {getPageNumbers().map((page, idx) =>
                    page === '...' ? (
                        <span key={`ellipsis-${idx}`} className="pg-ellipsis">…</span>
                    ) : (
                        <button
                            key={page}
                            className={`pg-btn${page === currentPage ? ' pg-btn--active' : ''}`}
                            onClick={() => onPageChange(page as number)}
                            aria-label={`Page ${page}`}
                        >
                            {page}
                        </button>
                    )
                )}

                <button
                    className="pg-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    aria-label="Next page"
                >
                    ›
                </button>
            </div>
        </div>
    );
};

export default CommonPagination;
