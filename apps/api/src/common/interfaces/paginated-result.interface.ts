export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pageCount: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

export function paginate<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResult<T> {
  return {
    data,
    meta: {
      total,
      page,
      limit,
      pageCount: total === 0 ? 0 : Math.ceil(total / limit),
    },
  };
}
