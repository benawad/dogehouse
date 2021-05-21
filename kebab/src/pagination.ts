export type PaginatedRequest<C extends number | string = number> = {
  cursor: C,
  limit: number
};

export type PaginatedReply<C extends number | string = number> = {
  nextCursor: C,
  initial: boolean
};
