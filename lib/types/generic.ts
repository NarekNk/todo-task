export type Paginated<T> = {
  items: Array<T>;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};
