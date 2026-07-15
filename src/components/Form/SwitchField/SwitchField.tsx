import { type FC } from 'react';
import { Switch, type SwitchProps } from 'antd';

type SwitchFieldProps = SwitchProps & {};

const SwitchField: FC<SwitchFieldProps> = ({ ...switchFieldProps }) => {
  return <Switch {...switchFieldProps} />;
};

export default SwitchField;
