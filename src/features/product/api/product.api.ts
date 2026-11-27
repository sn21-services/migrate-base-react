import type { AxiosResponse } from 'axios';
import type {
  ProductItem,
  ProductListResponse,
  ProductQueryParams,
  TypeProductInfo,
} from '../types/product.types';
import { ProductsEndPoint } from '../constants/products.endpoint';
import { instanceApi } from '@/api/base-api';
import { CamelParamsSerializer } from '../helpers/api.helpers';

export const getProductsApi = (
  params: ProductQueryParams
): Promise<AxiosResponse<ProductListResponse>> => {
  return instanceApi.get(ProductsEndPoint.SEARCH, {
    params,
    paramsSerializer: CamelParamsSerializer,
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
