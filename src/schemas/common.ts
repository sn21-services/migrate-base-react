import { string, ValidationError, type AnyObjectSchema } from 'yup';
import type { FormInstance } from 'antd';
import type { Rule } from 'antd/es/form';

export const createYupRule = (
  schema: AnyObjectSchema,
  form: FormInstance,
  path: string
): Rule => ({
  async validator() {
    try {
      const fields = schema.describe().fields;

      if (!(path in fields)) {
        return Promise.resolve();
      }

      await schema.validateAt(path, form.getFieldsValue(true));

      return Promise.resolve();
    } catch (error) {
      const yupError = error as ValidationError;

      return Promise.reject(yupError.message);
    }
  },
});
export const stringField = string().trim();
