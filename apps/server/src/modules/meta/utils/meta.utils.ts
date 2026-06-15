export type MetaPagination = {
  limit: number;
  offset: number;
};

export function withPagination<T>(items: T[], pagination: MetaPagination) {
  return {
    items,
    limit: pagination.limit,
    offset: pagination.offset,
  };
}
