import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import type {
  ProductItem,
  ProductListResponse,
  ProductQueryParams,
  TypeProductInfo,
} from '../types/product.types';
import {
  addProductApi,
  deletedProductApi,
  GetProductDetailApi,
  getProductsApi,
  updateProductApi,
} from '../api/product.api';
import { message } from 'antd';

export default function useProductsQuery(onMutationSuccess?: () => void) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [inputValue, setInputValue] = useState<string>('');

  const searchText = searchParams.get('q') || '';
  const sortOption = searchParams.get('sort') || 'default';
  const currentPage = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('limit')) || 10;
  const queryClient = useQueryClient();
  const [sortBy, order] =
    sortOption !== 'default'
      ? (sortOption.split('-') as [
          ProductQueryParams['sortBy'],
          ProductQueryParams['order'],
        ])
      : [undefined, undefined];
  const queryParams: ProductQueryParams = {
    q: searchParams.get('q') || '',
    limit: pageSize,
    skip: (currentPage - 1) * pageSize,
    sortBy,
    order,
  };

  const updateUrlParams = useCallback(
    (newParams: Record<string, string | null>) => {
      setSearchParams(prevParams => {
        const nextParams = new URLSearchParams(prevParams);
        Object.entries(newParams).forEach(([key, value]) => {
          if (
            !value ||
            value === 'default' ||
            (key === 'page' && value === '1') ||
            (key === 'limit' && value === '10')
          ) {
            nextParams.delete(key);
          } else {
            nextParams.set(key, value);
          }
        });
        return nextParams;
      });
    },
    [setSearchParams]
  );

  useEffect(() => {
    if (inputValue === searchText) return;
    const timer = setTimeout(() => {
      updateUrlParams({ q: inputValue.trim(), page: '1' });
    }, 400);
    return () => clearTimeout(timer);
  }, [inputValue, searchText, updateUrlParams]);

  const {
    data: productData,
    isLoading,
    isError,
    refetch,
  } = useQuery<ProductListResponse>({
    queryKey: ['products', queryParams],
    queryFn: async () => (await getProductsApi(queryParams)).data,
    placeholderData: keepPreviousData,
  });

  const { data: productDetail, isLoading: isLoadingDetail } =
    useQuery<ProductItem>({
      queryKey: ['product-detail', selectedProductId],
      queryFn: async () => {
        const res = await GetProductDetailApi(selectedProductId!);
        return res.data;
      },
      enabled: selectedProductId !== null,
    });

  //Mutation thêm sửa xóa
  const addMutation = useMutation({
    mutationFn: (newData: TypeProductInfo) => addProductApi(newData),
    onSuccess: () => {
      message.success('Thêm sản phẩm thành công!');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      onMutationSuccess?.();
    },
    onError() {
      message.error('Thêm sản phẩm thất bại!');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number | string;
      data: Partial<TypeProductInfo>;
    }) => updateProductApi(id, data),
    onSuccess: () => {
      message.success(`Sửa sản phẩm thành công!`);
      queryClient.invalidateQueries({ queryKey: ['products'] });
      onMutationSuccess?.();
    },
    onError() {
      message.error('Sửa sản phẩm thất bại!');
    },
  });

  const deletedMutation = useMutation({
    mutationFn: (id: number | string) => deletedProductApi(id),
    onSuccess() {
      message.success('Xóa sản phẩm thành công!');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      onMutationSuccess?.();
    },
    onError() {
      message.error('Xóa sản phẩm thất bại!');
    },
  });

  const handleReset = () => {
    setInputValue('');
    setSearchParams({});
  };
  return {
    products: productData?.products || [],
    total: productData?.total || 0,
    isLoading,
    isError,
    refetch,
    currentPage,
    pageSize,
    searchText,
    inputValue,
    sortOption,
    setInputValue,
    updateUrlParams,
    addMutation,
    updateMutation,
    handleReset,
    selectedProductId,
    setSelectedProductId,
    productDetail,
    isLoadingDetail,
    deletedMutation,
  };
}
