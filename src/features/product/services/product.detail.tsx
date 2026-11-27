import { Rate, Tag } from 'antd';
import type { objectItem } from './product.services';

export const objectKey: objectItem[] = [
  {
    key: 'brand',
    label: 'Thương hiệu',
  },
  {
    key: 'title',
    label: 'Tên sản phẩm',
  },
  {
    key: 'description',
    label: 'Mô tả',
  },
  {
    key: 'category',
    label: 'Danh mục',
    render: product => <Tag color={'yellow'}>{product.category}</Tag>,
  },
  {
    key: 'price',
    label: 'Giá',
    render: product => (
      <span className="text-red-600 font-bold">${product.price}</span>
    ),
  },
  {
    key: 'rating',
    label: 'Đánh giá',
    render: product => <Rate disabled allowHalf value={product.rating} />,
  },
  {
    key: 'stock',
    label: 'Tồn kho',
  },
];
