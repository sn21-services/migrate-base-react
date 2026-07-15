import { type FC } from 'react';
import { Button, type ButtonProps } from 'antd';

type AppButtonProps = ButtonProps & {};

const AppButton: FC<AppButtonProps> = ({ ...propsAppButton }) => {
  return <Button {...propsAppButton} />;
};

export default AppButton;
