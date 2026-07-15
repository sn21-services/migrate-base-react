import { type FC } from 'react';
import { Radio, type RadioGroupProps } from 'antd';

import type { OptionType } from '@/types/app.types';

type RadioGroupFieldProps = Omit<RadioGroupProps, 'options'> & {
  options: OptionType[];
};

const RadioGroupField: FC<RadioGroupFieldProps> = ({
  options,
  ...radioGroupFieldProps
}) => {
  return (
    <Radio.Group {...radioGroupFieldProps}>
      {options.map((option, index) => (
        <Radio key={`${option.value}-${index}`} value={option.value}>
          {option.label}
        </Radio>
      ))}
    </Radio.Group>
  );
};

export default RadioGroupField;
