import { type FC, type ComponentProps } from 'react';
import { Input } from 'antd';

type TextAreaProps = ComponentProps<typeof Input.TextArea>;

type TextAreaFieldProps = TextAreaProps & {};

const TextAreaField: FC<TextAreaFieldProps> = ({ ...textAreaFieldProps }) => {
  return <Input.TextArea {...textAreaFieldProps} />;
};

export default TextAreaField;
