import { type FC, type ReactNode, memo } from 'react';
import { type FormProps, Form } from 'antd';
import { type AnyObjectSchema } from 'yup';

import { FormContext } from '@/components/Form/FormContext/FormContext';

type AppFormProps = FormProps & {
  children: ReactNode;
  schema?: AnyObjectSchema;
};

const AppForm: FC<AppFormProps> = ({ children, form, schema, ...props }) => {
  return (
    <Form requiredMark={false} form={form} autoComplete="off" {...props}>
      <FormContext value={{ form, schema }}>{children}</FormContext>
    </Form>
  );
};

export default memo(AppForm);
