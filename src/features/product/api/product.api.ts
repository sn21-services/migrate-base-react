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
  return instanceApi.get(ProductsEndPoint.SEARCH, {
    params,
    paramsSerializer: {
      serialize: (rawParams: Record<string, unknown>) => {
        const searchParams = new URLSearchParams();
        Object.entries(rawParams).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, String(value));
          }
        });
        return searchParams.toString();
      },
    },
  });
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
): Promise<AxiosResponse<ProductItem>> => {
  return instanceApi.put(ProductsEndPoint.UPDATE_PRODUCT(id), data);
};

export const deletedProductApi = (
  id: number | string
): Promise<AxiosResponse> => {
  return instanceApi.delete(ProductsEndPoint.DELETED_PRODUCT(id));
};
