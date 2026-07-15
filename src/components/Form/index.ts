import { useContext } from 'react';
import { Form } from 'antd';

export { default as AppForm } from './AppForm/AppForm';
export { default as FormField } from './FormField/FormField';
export { default as InputField } from './InputField/InputField';
export { default as InputPasswordField } from './InputPasswordField/InputPasswordField';
export { default as FormAction } from './FormAction/FormAction';
export { default as CheckboxField } from './CheckboxField/CheckboxField';
export { default as CheckboxGroupField } from './CheckboxGroupField/CheckboxGroupField';
export { default as RadioGroupField } from './RadioGroupField/RadioGroupField';
export { default as SelectField } from './SelectField/SelectField';
export { default as DatePickerField } from './DatePickerField/DatePickerField';
export { default as TimePickerField } from './TimePickerField/TimePickerField';
export { default as SwitchField } from './SwitchField/SwitchField';
export { default as UploadField } from './UploadField/UploadField';
export { default as TextAreaField } from './TextAreaField/TextAreaField';
export { default as InputNumberField } from './InputNumberField/InputNumberField';

import { FormContext } from './FormContext/FormContext';

export const useForm = Form.useForm;

export const useWatch = Form.useWatch;

export const useAppForm = () => useContext(FormContext);
