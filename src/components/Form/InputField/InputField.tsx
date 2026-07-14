import { type FC, type ReactNode } from 'react';
import { Input, type InputProps, Typography } from 'antd';

type InputFieldProps = InputProps & {
  helperText?: ReactNode;
};

const InputField: FC<InputFieldProps> = ({
  helperText,
  ...propsInputField
}) => {
  return (
    <>
      <Input {...propsInputField} />
      {helperText && (
        <Typography.Text type="secondary">{helperText}</Typography.Text>
      )}
    </>
  );
};

export default InputField;
