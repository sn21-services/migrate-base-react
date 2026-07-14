import { type InferType, object, array } from 'yup';

import { stringField } from '@/schemas/common';

export const userSchema = object({
  email: stringField.required('Vui lòng nhập email'),
  password: stringField.required('Vui lòng nhập password'),
  avatar: array().min(1, 'Vui lòng chọn ảnh'),
});

export type UserFormValues = InferType<typeof userSchema>;
