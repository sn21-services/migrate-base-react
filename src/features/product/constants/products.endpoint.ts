export const ProductsEndPoint = {
  GET_LIST: '/products',
  SEARCH: '/products/search',
  GET_DETAIL: (id: number | string) => `/products/${id}`,
  ADD_PRODUCT: '/products/add',
  UPDATE_PRODUCT: (id: number | string) => `/products/${id}`,
  DELETED_PRODUCT: (id: number | string) => `/products/${id}`,
} as const;
