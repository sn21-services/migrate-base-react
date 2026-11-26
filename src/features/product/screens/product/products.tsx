import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import {
  addProductApi,
  deletedProductApi,
  GetProductDetailApi,
  getProductsApi,
  updateProductApi,
} from '../../api/product.api';
import type {
  ProductItem,
  ProductListResponse,
  ProductQueryParams,
  TypeProductInfo,
} from '../../types/product.types';
import {
  Button,
  Descriptions,
  Image,
  Input,
  Modal,
  Popconfirm,
  Rate,
  Select,
  Spin,
  Table,
  Tag,
  type UploadFile,
  type UploadProps,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import {
  AppForm,
  FormField,
  InputField,
  InputNumberField,
  UploadField,
  useForm,
} from '@/components/Form';
import { productYupSchema } from '../../schemas/product.schemas';
import { UploadOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router';
import {
  formatProductPayload,
  useCategoryList,
} from '../../services/product.services';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categoryData, isLoading: isLoadingCategory } = useCategoryList();
  const searchText = searchParams.get('q') || '';
  const sortOption = searchParams.get('sort') || 'default';
  const currentPage = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('limit')) || 10;
  const queryClient = useQueryClient();
  const [form] = useForm<TypeProductInfo>();
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
  const [editingItem, setEditingItem] = useState<ProductItem | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);

  const [thumbnailFileList, setThumbnailFileList] = useState<UploadFile[]>([]);
  const [imagesFileList, setImagesFileList] = useState<UploadFile[]>([]);

  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
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
      return () => clearTimeout(timer);
    }, 400);
  }, [inputValue, searchText, updateUrlParams]);

  const {
    data: productData,
    isError,
    refetch,
  } = useQuery<ProductListResponse>({
    queryKey: ['products', queryParams],
    queryFn: async () => {
      const res = await getProductsApi(queryParams);

      return res.data;
    },
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
  const products: ProductItem[] = productData?.products || [];

  const handleCloseModal = () => {
    thumbnailFileList.forEach(file => {
      if (file.url?.startsWith('blob:')) URL.revokeObjectURL(file.url);
    });
    imagesFileList.forEach(file => {
      if (file.url?.startsWith('blob:')) URL.revokeObjectURL(file.url);
    });

    setOpen(false);
    setEditingItem(null);
    setThumbnailFileList([]);
    setImagesFileList([]);
    form.resetFields();
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setThumbnailFileList([]);
    setImagesFileList([]);
    form.resetFields();
    setOpen(true);
  };
  const addMutation = useMutation({
    mutationFn: (newData: TypeProductInfo) => addProductApi(newData),
    onSuccess: () => {
      message.success('Thêm sản phẩm thành công!');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      handleCloseModal();
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
      handleCloseModal();
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
      if (editingItem) {
        setEditingItem(null);
        handleCloseModal();
      }
    },
    onError() {
      message.error('Xóa sản phẩm thất bại!');
    },
  });

  const handleSubmit = (data: TypeProductInfo) => {
    const payload = formatProductPayload(data);

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: payload });
    } else addMutation.mutate(payload);
  };

  const handleEdit = (record: ProductItem) => {
    setEditingItem(record);
    setThumbnailFileList(
      record.thumbnail
        ? [
            {
              uid: '-1',
              name: 'thumbnail.png',
              status: 'done',
              url: record.thumbnail,
            },
          ]
        : []
    );
    setImagesFileList(
      (record.images || []).map((url, idx) => ({
        uid: `-${idx + 2}`,
        name: `image-${idx + 1}.png`,
        status: 'done',
        url,
      }))
    );
    setOpen(true);
    const payload = formatProductPayload(record);
    form.setFieldsValue(payload);
  };

  const handleSearch = (value: string) => {
    setInputValue(value);
    updateUrlParams({ q: value.trim(), page: '1' });
  };

  const handleSort = (value: string) => {
    updateUrlParams({ sort: value, page: '1' });
  };
  const handleReset = () => {
    setInputValue('');
    setSearchParams({});
  };

  const columns: ColumnsType<ProductItem> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Ảnh',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      render(url: string, record: ProductItem) {
        return (
          <Image
            src={url}
            alt={record.title}
            width={48}
            height={48}
            className="rounded object-cover"
          />
        );
      },
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record) => (
        <div>
          <div className="font-medium">{text}</div>
          {record.brand && (
            <div className="text-xs text-gray-400">{record.brand}</div>
          )}
        </div>
      ),
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render(price: number) {
        return `$${price}`;
      },
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => <Rate disabled allowHalf value={rating} />,
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: 'Hành động',
      key: 'action',
      render(_, record) {
        return (
          <div className="flex flex-wrap gap-2">
            <Button
              type="primary"
              onClick={() => setSelectedProductId(record.id)}
            >
              Chi tiết
            </Button>
            <Button onClick={() => handleEdit(record)}>Sửa</Button>
            <Popconfirm
              title="Xóa"
              description="Bạn có chắc chắn muốn xóa?"
              onConfirm={() => deletedMutation.mutate(record.id)}
            >
              <Button>Xóa</Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  const [imagePreview, setImagePreview] = useState<string>('');

  //upload ảnh

  const handleThumbnailChange: UploadProps['onChange'] = ({ fileList }) => {
    const lastFile = fileList.slice(-1);
    if (lastFile.length > 0) {
      const file = lastFile[0];
      if (!file.url && file.originFileObj) {
        file.url = URL.createObjectURL(file.originFileObj);
      }
      setThumbnailFileList([file]);
      form.setFieldValue('thumbnail', file.url || '');
    } else {
      if (thumbnailFileList[0]?.url?.startsWith('blob:')) {
        URL.revokeObjectURL(thumbnailFileList[0].url);
      }
      setThumbnailFileList([]);
      form.setFieldValue('thumbnail', '');
    }
  };

  const handleImageChange: UploadProps['onChange'] = ({ fileList }) => {
    const updateList = fileList.map(file => {
      if (!file.url && file.originFileObj) {
        file.url = URL.createObjectURL(file.originFileObj);
      }
      return file;
    });
    setImagesFileList(updateList);
    const ImagesUrl = updateList
      .map(file => file.url)
      .filter((url): url is string => Boolean(url));
    form.setFieldValue('images', ImagesUrl);
  };

  if (isError) {
    return (
      <div className="p-4">
        <p className="text-red-500 mb-2">Lỗi tải danh sách sản phẩm!</p>
        <Button onClick={() => refetch()}>Thử lại</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="p-4">
        <h2 className="font-bold text-2xl mb-2">Products</h2>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Input.Search
            placeholder="Nhập tên sản phẩm"
            enterButton="Tìm kiếm"
            allowClear
            value={inputValue}
            onSearch={handleSearch}
            onChange={e => setInputValue(e.target.value)}
            style={{ flex: 1 }}
          />

          <Select
            value={sortOption}
            onChange={handleSort}
            getPopupContainer={trigger => trigger.parentElement}
            style={{ width: 200 }}
            options={[
              { value: 'default', label: 'Sắp xếp: Mặc định' },
              { value: 'title-asc', label: 'Tên: A -> Z' },
              { value: 'title-desc', label: 'Tên: Z -> A' },
              { value: 'price-asc', label: 'Giá: Thấp → Cao' },
              { value: 'price-desc', label: 'Giá: Cao → Thấp' },
              { value: 'rating-desc', label: 'Đánh giá: Cao nhất' },
            ]}
          />
          {(searchText || sortOption !== 'default') && (
            <Button onClick={handleReset}>Đặt lại</Button>
          )}

          <Button onClick={handleOpenAdd}>Thêm sản phẩm</Button>
        </div>

        <Table
          rowKey={'id'}
          dataSource={products}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: productData?.total,
            showSizeChanger: true,
            onChange: (page, size) => {
              updateUrlParams({ page: String(page), limit: String(size) });
            },
          }}
          columns={columns}
        />

        <Modal
          style={{ width: 700 }}
          title={productDetail?.title || 'Chi tiết sản phẩm'}
          open={selectedProductId !== null}
          onCancel={() => setSelectedProductId(null)}
          footer={[
            <Button
              type="primary"
              key="close"
              onClick={() => setSelectedProductId(null)}
            >
              Đóng
            </Button>,
          ]}
        >
          {isLoadingDetail ? (
            <div className="flex justify-center py-10">
              <Spin size="small" />
            </div>
          ) : (
            productDetail && (
              <div className="grid grid-cols-2">
                <div>
                  <Image
                    width={200}
                    height={200}
                    className="rounded object-cover overflow-hidden"
                    src={imagePreview || productDetail?.thumbnail}
                  />
                  <div className="flex gap-2 items-center mt-2">
                    {productDetail?.images.map((src, index) => (
                      <img
                        key={index}
                        onClick={() => setImagePreview(src)}
                        className="w-15 h-15 rounded object-cover overflow-hidden"
                        src={src}
                      />
                    ))}
                  </div>
                </div>

                <Descriptions column={1}>
                  <Descriptions.Item label="Thương hiệu">
                    {productDetail.brand}
                  </Descriptions.Item>

                  <Descriptions.Item label="Tên sản phẩm">
                    {productDetail.title}
                  </Descriptions.Item>
                  <Descriptions.Item label="Mô tả">
                    {productDetail.description}
                  </Descriptions.Item>
                  <Descriptions.Item label="Danh mục">
                    <Tag color={'yellow'}>{productDetail.category}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Giá">
                    <span className="text-red-500 font-bold">
                      ${productDetail.price}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Đánh giá">
                    <Rate allowHalf defaultValue={productDetail.rating} />
                  </Descriptions.Item>
                  <Descriptions.Item label="Tồn kho">
                    {productDetail.stock}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            )
          )}
        </Modal>

        <Modal
          open={open}
          title={editingItem ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
          width={800}
          onCancel={handleCloseModal}
          footer={null}
        >
          <AppForm
            form={form}
            onFinish={handleSubmit}
            initialValues={{
              title: '',
              description: '',
              category: 'smartphones',
              price: 0,
              discountPercentage: 0,
              rating: 0,
              stock: 1,
              tags: [],
              brand: '',
              sku: '',
              weight: 0,
              dimensions: {
                width: 0,
                height: 0,
                depth: 0,
              },
              warrantyInformation: '1 year warranty',
              shippingInformation: 'Ships in 1-2 business days',
              availabilityStatus: 'In Stock',
              reviews: [],
              returnPolicy: '30 days return policy',
              minimumOrderQuantity: 1,
              meta: {
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                barcode: '',
                qrCode: '',
              },
              thumbnail: '',
              images: [],
            }}
            schema={productYupSchema}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <FormField label="Tên sản phẩm" name="title">
                <InputField placeholder="Nhập tên sản phẩm" />
              </FormField>

              <FormField label="Danh mục" name="category">
                <Select
                  placeholder="Chọn danh mục"
                  loading={isLoadingCategory}
                  options={categoryData.map(category => ({
                    value: category,
                    label: String(category).toUpperCase(),
                  }))}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <FormField label="Thương hiệu (Brand)" name="brand">
                <InputField placeholder="Ví dụ: Apple, Samsung..." />
              </FormField>

              <FormField label="Mã SKU" name="sku">
                <InputField placeholder="Ví dụ: IP16-PM-256" />
              </FormField>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4">
              <FormField label="Giá ($)" name="price">
                <InputNumberField
                  min={0}
                  step={0.01}
                  className="w-full"
                  placeholder="0"
                />
              </FormField>

              <FormField label="Giảm giá (%)" name="discountPercentage">
                <InputNumberField
                  min={0}
                  max={100}
                  className="w-full"
                  placeholder="0"
                />
              </FormField>

              <FormField label="Tồn kho" name="stock">
                <InputNumberField min={0} className="w-full" placeholder="1" />
              </FormField>

              <FormField label="Đặt tối thiểu" name="minimumOrderQuantity">
                <InputNumberField min={1} className="w-full" placeholder="1" />
              </FormField>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4">
              <FormField label="Trọng lượng (g)" name="weight">
                <InputNumberField min={0} className="w-full" placeholder="0" />
              </FormField>

              <FormField label="Rộng (Width)" name={['dimensions', 'width']}>
                <InputNumberField min={0} className="w-full" placeholder="0" />
              </FormField>

              <FormField label="Cao (Height)" name={['dimensions', 'height']}>
                <InputNumberField min={0} className="w-full" placeholder="0" />
              </FormField>

              <FormField label="Sâu (Depth)" name={['dimensions', 'depth']}>
                <InputNumberField min={0} className="w-full" placeholder="0" />
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4">
              <div className="md:col-span-2">
                <FormField
                  label="Danh sách link ảnh (Images - Nhấn Enter sau mỗi link)"
                  name="images"
                >
                  <UploadField
                    accept="image/*"
                    beforeUpload={() => false}
                    fileList={imagesFileList}
                    onChange={handleImageChange}
                    multiple
                    listType="picture"
                  >
                    <Button icon={<UploadOutlined />}>Upload image</Button>
                  </UploadField>
                </FormField>
              </div>

              <FormField label="Đánh giá (Rating)" name="rating">
                <InputNumberField
                  min={0}
                  max={5}
                  step={0.1}
                  className="w-full"
                  placeholder="0 - 5"
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <FormField label="Tags (Nhấn Enter để thêm)" name="tags">
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  placeholder="Nhập tag rồi nhấn Enter"
                  tokenSeparators={[',']}
                />
              </FormField>

              <FormField label="Ảnh đại diện (Thumbnail)" name="thumbnail">
                <UploadField
                  accept="image/*"
                  beforeUpload={() => false}
                  fileList={thumbnailFileList}
                  onChange={handleThumbnailChange}
                  multiple
                  listType="picture"
                  maxCount={1}
                >
                  <Button type="default" icon={<UploadOutlined />}>
                    Upload avatar
                  </Button>
                </UploadField>
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4">
              <FormField label="Bảo hành" name="warrantyInformation">
                <InputField placeholder="Ví dụ: 1 year warranty" />
              </FormField>

              <FormField label="Vận chuyển" name="shippingInformation">
                <InputField placeholder="Ví dụ: Ships in 1-2 business days" />
              </FormField>

              <FormField label="Chính sách đổi trả" name="returnPolicy">
                <InputField placeholder="Ví dụ: 30 days return policy" />
              </FormField>
            </div>

            <FormField label="Mô tả sản phẩm" name="description">
              <Input.TextArea
                rows={3}
                placeholder="Nhập mô tả chi tiết sản phẩm..."
              />
            </FormField>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                onClick={() => {
                  handleCloseModal();
                }}
              >
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={addMutation.isPending || updateMutation.isPending}
              >
                {editingItem ? 'Cập nhật' : 'Tạo'}
              </Button>
            </div>
          </AppForm>
        </Modal>
      </div>
    </div>
  );
}
