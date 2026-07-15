import { type FC } from 'react';
import { type InputProps } from 'antd';
import { NumericFormat, type NumericFormatProps } from 'react-number-format';

import InputField from '../InputField/InputField';

type InputNumberFieldProps = Omit<
  NumericFormatProps<InputProps>,
  'customInput'
>;

const InputNumberField: FC<InputNumberFieldProps> = ({
  ...inputNumberFIeldProps
}) => {
  return <NumericFormat customInput={InputField} {...inputNumberFIeldProps} />;
};

export default InputNumberField;
