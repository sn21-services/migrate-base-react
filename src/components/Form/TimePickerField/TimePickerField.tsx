import { type FC } from 'react';
import { TimePicker, type TimePickerProps } from 'antd';

type TimePickerFieldProps = TimePickerProps & {};

const TimePickerField: FC<TimePickerFieldProps> = ({
  ...timePickerFieldProps
}) => {
  return <TimePicker {...timePickerFieldProps} />;
};

export default TimePickerField;
