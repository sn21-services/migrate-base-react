import { Button, Descriptions, Modal, Image, Spin, Tag, Rate } from 'antd';
import { useState } from 'react';
import type { ProductItem } from '../types/product.types';

interface Props {
  open: boolean;
  onClose: () => void;
  product?: ProductItem;
  isLoading: boolean;
}
export default function ProductDetailModal({
  open,
  onClose,
  product,
  isLoading,
}: Props) {
  const [imagePreview, setImagePreview] = useState<string>('');

  return (
    <Modal
      width={700}
      title={product?.title || 'Chi tiết sản phẩm'}
      open={open}
      onCancel={onClose}
      footer={[
        <Button type="primary" key="close" onClick={onClose}>
          Đóng
        </Button>,
      ]}
    >
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Spin size="small" />
        </div>
      ) : (
        product && (
          <div className="grid grid-cols-2">
            <div>
              <Image
                width={200}
                height={200}
                className="rounded object-cover overflow-hidden"
                src={imagePreview || product?.thumbnail}
              />
              <div className="flex gap-2 items-center mt-2">
                {product?.images.map((src, index) => (
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
                {product.brand}
              </Descriptions.Item>

              <Descriptions.Item label="Tên sản phẩm">
                {product.title}
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả">
                {product.description}
              </Descriptions.Item>
              <Descriptions.Item label="Danh mục">
                <Tag color={'yellow'}>{product.category}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Giá">
                <span className="text-red-500 font-bold">${product.price}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Đánh giá">
                <Rate disabled allowHalf defaultValue={product.rating} />
              </Descriptions.Item>
              <Descriptions.Item label="Tồn kho">
                {product.stock}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )
      )}
    </Modal>
  );
}
