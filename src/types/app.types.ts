import type { ComponentType, ReactNode } from 'react';

export type ApiResponse<T> = {
  data: T;
};

export type IconType =
  | string
  | ComponentType<React.SVGProps<SVGSVGElement>>
  | ComponentType<React.ImgHTMLAttributes<HTMLImageElement>>;

export type OptionType = {
  label: string | ReactNode;
  value: string;
  icon?: IconType;
  children?: ReactNode;
  description?: string;
};
