export const getPaginationInfo = ({
  totalCount,
  limit,
  page,
}: {
  totalCount: number;
  limit: number;
  page: number;
}) => {
  const totalPages = Math.ceil((totalCount * 1) / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  return {
    totalCount: totalCount * 1,
    totalPages: totalPages,
    hasNextPage: hasNextPage,
    hasPrevPage: hasPrevPage,
    currentPage: page,
  };
};
