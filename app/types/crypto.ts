export type Crypto = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
};
export type CryptoList = Crypto[];
export type CryptoListResponse = {
  data: Crypto[];
};
export type CryptoResponse = {
  data: Crypto;
};
export type Error = {
  error: string;
};
export type ErrorResponse = {
  error: Error;
};
export type PaginatedList = {
  data: CryptoList;
  total: number;
};
export type PaginatedListResponse = {
  data: PaginatedList;
};
