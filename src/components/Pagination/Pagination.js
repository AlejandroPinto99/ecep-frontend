import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

export const Pagination = ({ currentPage = 1, totalPages, setPage }) => {

    const getPagesToRender = () => {
        if (totalPages <= 4) return Array.from({ length: totalPages }, (_, i) => i + 1);
    
        if (currentPage === 1) return [1, 2, 3, 4];
        if (currentPage === totalPages) return [totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        
        return [currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
    };
    
    return (
        <div className="flex space-x-4 items-center">
            <button type="button" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>
                <ChevronLeftIcon className={`h-5 w-5  font-bold ${currentPage === 1 ? 'text-gray-300' : 'text-klintoRed' } `} />
            </button>
            {getPagesToRender().map((page) => (
                <button
                    key={page}
                    onClick={() => setPage(page)}
                    className={`page-item text-klintoRed ${page === currentPage ? 'active' : ''}`}
                    style={{ fontWeight: page === currentPage ? 'bold' : 'normal' }}
                >
                {page}
                </button>
            ))}
            <button type="button" disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}>
                <ChevronRightIcon className={`h-5 w-5  font-bold ${currentPage === totalPages ? 'text-gray-300' : 'text-klintoRed'}`} />
            </button>
        </div>
    )
}