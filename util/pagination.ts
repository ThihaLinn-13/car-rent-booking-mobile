export const calcHasNext = (page: number, size: number, total: number) =>
  (page + 1) * size < total;
