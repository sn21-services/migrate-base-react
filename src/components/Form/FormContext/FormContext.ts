import { createContext } from 'react';
import { type FormProps } from 'antd';
import { type AnyObjectSchema } from 'yup';

export const FormContext = createContext<{
  form?: FormProps['form'];
  schema?: AnyObjectSchema;
}>({});
