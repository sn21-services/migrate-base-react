import * as yup from 'yup';

export const productYupSchema = yup.object({
  title: yup
    .string()
    .trim()
    .required('Vui lòng nhập tên sản phẩm')
    .min(2, 'Tên sản phẩm phải có ít nhất 2 ký tự'),
  description: yup.string().trim().default(''),
  category: yup.string().required('Vui lòng chọn danh mục'),
  price: yup
    .number()
    .typeError('Giá phải là số')
    .required('Vui lòng nhập giá')
    .moreThan(0, 'Giá sản phẩm phải lớn hơn 0'),
  discountPercentage: yup
    .number()
    .typeError('Giảm giá phải là số')
    .min(0, 'Tối thiểu 0%')
    .max(100, 'Tối đa 100%')
    .default(0),
  rating: yup.number().min(0).max(5).default(0),
  stock: yup
    .number()
    .typeError('Tồn kho phải là số')
    .integer('Số lượng tồn kho phải là số nguyên')
    .min(0, 'Tồn kho không được âm')
    .required('Vui lòng nhập số lượng tồn kho'),
  tags: yup.array().of(yup.string().required()).default([]),
  brand: yup.string().trim().optional(),
  sku: yup.string().trim().required('Vui lòng nhập mã SKU'),
  weight: yup.number().min(0, 'Trọng lượng không được âm').default(0),
  dimensions: yup.object({
    width: yup.number().min(0).default(0),
    height: yup.number().min(0).default(0),
    depth: yup.number().min(0).default(0),
  }),
  warrantyInformation: yup.string().default(''),
  shippingInformation: yup.string().default(''),
  availabilityStatus: yup.string().default('In Stock'),
  returnPolicy: yup.string().default(''),
  minimumOrderQuantity: yup
    .number()
    .integer()
    .min(1, 'Số lượng đặt tối thiểu là 1')
    .default(1),
  thumbnail: yup.string().default(''),
  images: yup.array().of(yup.string().required()).default([]),
});
