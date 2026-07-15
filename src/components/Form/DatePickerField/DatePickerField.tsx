import { type FC } from 'react';
import { DatePicker, type DatePickerProps } from 'antd';

type DatePickerFieldProps = DatePickerProps & {};

const DatePickerField: FC<DatePickerFieldProps> = ({
  ...datePickerFieldProps
}) => {
  return <DatePicker {...datePickerFieldProps} />;
};

export default DatePickerField;
