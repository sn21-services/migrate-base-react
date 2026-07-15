import { type FC, type ReactNode, useMemo } from 'react';
import { Form, type FormItemProps } from 'antd';

import { createYupRule } from '@/schemas/common';
import { useAppForm } from '@/components/Form';

type FormFieldProps = FormItemProps & {
  children: ReactNode;
};

const FormField: FC<FormFieldProps> = ({
  children,
  rules,
  name,
  ...propsFormField
}) => {
  const { schema, form } = useAppForm();

  const mergedRules = useMemo(() => {
    if (!schema || !form || !name) {
      return rules;
    }

    return [createYupRule(schema, form, String(name)), ...(rules ?? [])];
  }, [schema, form, name, rules]);

  return (
    <Form.Item {...propsFormField} name={name} rules={mergedRules}>
      {children}
    </Form.Item>
  );
};

export default FormField;
