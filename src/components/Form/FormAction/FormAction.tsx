import { type FC, type ReactNode } from 'react';

type FormActionProps = {
  children: ReactNode;
};

const FormAction: FC<FormActionProps> = ({ children }) => {
  return <div className="flex items-center justify-end gap-3">{children}</div>;
};

export default FormAction;
