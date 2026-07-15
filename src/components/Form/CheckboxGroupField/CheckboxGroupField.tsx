import { type FC, type ComponentProps } from 'react';
import { Checkbox } from 'antd';

import type { OptionType } from '@/types/app.types';
import CheckboxField from '../CheckboxField/CheckboxField';

type CheckboxGroupProps = ComponentProps<typeof Checkbox.Group>;

type CheckboxGroupFieldProps = Omit<CheckboxGroupProps, 'options'> & {
  options: OptionType[];
};

const CheckboxGroupField: FC<CheckboxGroupFieldProps> = ({
  options,
  ...checkboxGroupFieldProps
}) => {
  return (
    <Checkbox.Group {...checkboxGroupFieldProps}>
      {options.map((option, index) => (
        <CheckboxField key={`${option.value}-${index}`} value={option.value}>
          {option.label}
        </CheckboxField>
      ))}
    </Checkbox.Group>
  );
};

export default CheckboxGroupField;
