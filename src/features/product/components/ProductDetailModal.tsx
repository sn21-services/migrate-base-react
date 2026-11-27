import { Button, Descriptions, Modal, Image, Spin } from 'antd';
import { useState } from 'react';
import type { ProductItem } from '../types/product.types';
import { objectKey } from '../services/product.detail';

interface ProductDetailProps {
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
}: ProductDetailProps) {
  const [imagePreview, setImagePreview] = useState<string>('');

  return (
    <Modal
      width={700}
      title={product?.title ?? 'Chi tiết sản phẩm'}
      open={open}
      onCancel={onClose}
      footer={[
        <Button type="primary" key="close" onClick={onClose}>
          Đóng
        </Button>,
      ]}
    >
      <Spin size="medium" spinning={isLoading}>
        {product && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Image
                width={200}
                height={200}
                className="rounded object-cover overflow-hidden"
                src={imagePreview || product.thumbnail}
              />
              <div className="flex gap-2 items-center mt-2">
                {product.images?.map((src, index) => (
                  <img
                    key={index}
                    onClick={() => setImagePreview(src)}
                    className="w-15 h-15 rounded object-cover overflow-hidden cursor-pointer"
                    src={src}
                    alt={`preview-${index}`}
                  />
                ))}
              </div>
            </div>

            <Descriptions column={1}>
              {objectKey.map(item => (
                <Descriptions.Item key={item.key} label={item.label}>
                  {item.render
                    ? item.render(product)
                    : String(product[item.key] ?? '')}
                </Descriptions.Item>
              ))}
            </Descriptions>
          </div>
        )}
      </Spin>
    </Modal>
  );
}
