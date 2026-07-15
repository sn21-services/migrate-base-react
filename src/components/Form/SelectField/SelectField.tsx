import { type FC } from 'react';
import { Select, type SelectProps } from 'antd';

type SelectFieldProps = SelectProps & {};

const SelectField: FC<SelectFieldProps> = ({ ...selectFieldProps }) => {
  return <Select {...selectFieldProps} />;
};

export default SelectField;
