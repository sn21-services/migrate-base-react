import { type FC, type ReactNode } from 'react';
import { Upload, type UploadProps } from 'antd';

type UploadFieldProps = UploadProps & {
  children?: ReactNode;
};

const UploadField: FC<UploadFieldProps> = ({
  children,
  beforeUpload,
  ...uploadFieldProps
}) => {
  return (
    <Upload beforeUpload={beforeUpload ?? (() => false)} {...uploadFieldProps}>
      {children}
    </Upload>
  );
};

export default UploadField;
