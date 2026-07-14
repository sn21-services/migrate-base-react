import { type FC } from 'react';
import { Input, type InputProps, Typography } from 'antd';

type InputPasswordFieldProps = InputProps & {
  helperText?: string;
};

const InputPasswordField: FC<InputPasswordFieldProps> = ({
  helperText,
  ...inputPasswordFieldProps
}) => {
  return (
    <>
      <Input.Password {...inputPasswordFieldProps} />
      {helperText && (
        <Typography.Text type="secondary">{helperText}</Typography.Text>
      )}
    </>
  );
};

export default InputPasswordField;
