import type { AxiosResponse } from 'axios';
import type {
  ProductItem,
  ProductListResponse,
  ProductQueryParams,
  TypeProductInfo,
} from '../types/product.types';
import { ProductsEndPoint } from '../constants/products.endpoint';
import { instanceApi } from '@/api/base-api';

export const getProductsApi = (
  params: ProductQueryParams
): Promise<AxiosResponse<ProductListResponse>> => {
  const searchParams = new URLSearchParams();
  if (params.q?.trim()) {
    searchParams.set('q', params.q.trim());
  }
  if (params.limit !== undefined) {
    searchParams.set('limit', String(params.limit));
  }
  if (params.skip !== undefined) {
    searchParams.set('skip', String(params.skip));
  }
  if (params.select?.trim()) {
    searchParams.set('select', params.select.trim());
  }
  if (params.order) {
    searchParams.set('order', params.order);
  }
  if (params.sortBy) {
    searchParams.set('sortBy', params.sortBy);
  }

  const endpoint = params.q?.trim()
    ? ProductsEndPoint.SEARCH
    : ProductsEndPoint.GET_LIST;

  return instanceApi.get(`${endpoint}?${searchParams.toString()}`);
};

export const GetProductDetailApi = (
  id: number | string
): Promise<AxiosResponse<ProductItem>> => {
  return instanceApi.get(ProductsEndPoint.GET_DETAIL(id));
};

export const addProductApi = (
  data: TypeProductInfo
): Promise<AxiosResponse<ProductItem>> => {
  return instanceApi.post(ProductsEndPoint.ADD_PRODUCT, data);
};

export const updateProductApi = (
  id: number | string,
  data: Partial<TypeProductInfo>
): Promise<AxiosResponse<TypeProductInfo>> => {
  return instanceApi.put(ProductsEndPoint.UPDATE_PRODUCT(id), data);
};

export const deletedProductApi = (
  id: number | string
): Promise<AxiosResponse> => {
  return instanceApi.delete(ProductsEndPoint.DELETED_PRODUCT(id));
};
