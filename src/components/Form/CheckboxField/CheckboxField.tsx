import { type FC } from 'react';
import { type CheckboxProps, Checkbox } from 'antd';

type CheckboxFieldProps = CheckboxProps & {};

const CheckboxField: FC<CheckboxFieldProps> = ({ ...checkboxFieldProps }) => {
  return <Checkbox {...checkboxFieldProps} />;
};

export default CheckboxField;
