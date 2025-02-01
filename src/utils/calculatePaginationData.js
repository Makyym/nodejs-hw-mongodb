export const calculatePaginationData = (count, perPage, page) => {
    const totalPages = Math.ceil(count / perPage);
    const hasNextPage = (totalPages - page) >= 1;
    const hasPreviousPage = page !== 1 && (page - 1) === totalPages || page === totalPages;
    return {
        page,
        perPage,
        totalItems: count,
        totalPages,
        hasPreviousPage,
        hasNextPage,
    };
};