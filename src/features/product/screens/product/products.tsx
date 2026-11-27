import { Button, Image, Input, Popconfirm, Rate, Select, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import type { ProductItem, TypeProductInfo } from '../../types/product.types';
import ProductFormModal from '../../components/ProductFormModal';
import ProductDetailModal from '../../components/ProductDetailModal';
import useProductsQuery from '../../hooks/useProductsQuery';

export default function Products() {
  const [openFormModal, setOpenFormModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ProductItem | null>(null);

  const handleCloseForm = () => {
    setOpenFormModal(false);
    setEditingItem(null);
  };

  const {
    products,
    total,
    isLoading,
    isError,
    refetch,
    currentPage,
    pageSize,
    searchText,
    sortOption,
    inputValue,
    setInputValue,
    updateUrlParams,
    handleReset,
    selectedProductId,
    setSelectedProductId,
    productDetail,
    isLoadingDetail,
    addMutation,
    updateMutation,
    deletedMutation,
  } = useProductsQuery(handleCloseForm);

  const handleFormSubmit = (payload: TypeProductInfo) => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: payload });
    } else {
      addMutation.mutate(payload);
    }
  };

  const columns: ColumnsType<ProductItem> = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    {
      title: 'Ảnh',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      render: (url: string, record) => (
        <Image
          src={url}
          alt={record.title}
          width={48}
          height={48}
          className="rounded object-cover"
        />
      ),
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
    { title: 'Danh mục', dataIndex: 'category', key: 'category' },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price}`,
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => <Rate disabled allowHalf value={rating} />,
    },
    { title: 'Tồn kho', dataIndex: 'stock', key: 'stock' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <div className="flex flex-wrap gap-2">
          <Button
            type="primary"
            onClick={() => setSelectedProductId(record.id)}
          >
            Chi tiết
          </Button>
          <Button
            onClick={() => {
              setEditingItem(record);
              setOpenFormModal(true);
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa"
            description="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => deletedMutation.mutate(record.id)}
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  if (isError) {
    return (
      <div className="p-4">
        <p className="text-red-500 mb-2">Lỗi tải danh sách sản phẩm!</p>
        <Button onClick={() => refetch()}>Thử lại</Button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="font-bold text-2xl mb-2">Products</h2>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Input.Search
          placeholder="Nhập tên sản phẩm"
          enterButton="Tìm kiếm"
          allowClear
          value={inputValue}
          onSearch={val => {
            setInputValue(val);
            updateUrlParams({ q: val.trim(), page: '1' });
          }}
          onChange={e => setInputValue(e.target.value)}
          style={{ flex: 1 }}
        />

        <Select
          value={sortOption}
          onChange={val => updateUrlParams({ sort: val, page: '1' })}
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

        <Button
          type="primary"
          onClick={() => {
            setEditingItem(null);
            setOpenFormModal(true);
          }}
        >
          Thêm sản phẩm
        </Button>
      </div>

      <Table
        rowKey="id"
        loading={isLoading}
        dataSource={products}
        columns={columns}
        pagination={{
          current: currentPage,
          pageSize,
          total,
          showSizeChanger: true,
          onChange: (page, size) =>
            updateUrlParams({ page: String(page), limit: String(size) }),
        }}
      />

      <ProductDetailModal
        key={selectedProductId ?? 'closed'}
        open={selectedProductId !== null}
        product={productDetail}
        isLoading={isLoadingDetail}
        onClose={() => setSelectedProductId(null)}
      />

      <ProductFormModal
        key={
          openFormModal
            ? editingItem
              ? `form-edit-${editingItem.id}`
              : 'form-create'
            : 'form-closed'
        }
        open={openFormModal}
        editingItem={editingItem}
        isSubmitting={addMutation.isPending || updateMutation.isPending}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
