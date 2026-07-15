import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Link } from 'react-router';

import { HomePathsEnum } from '@/features/home/constants/home.paths';

type MenuItem = Required<MenuProps>['items'][number];

export const MENU_APP: MenuItem[] = [
  {
    key: HomePathsEnum.HOME,
    icon: <PieChartOutlined />,
    label: <Link to={HomePathsEnum.HOME}>Trang chủ</Link>,
  },
  {
    key: '/todo',
    icon: <DesktopOutlined />,
    label: <Link to="/todo">Thiết kế chương trình</Link>,
  },
  { key: '3', icon: <ContainerOutlined />, label: 'Option 3' },
  {
    key: 'sub1',
    label: 'Navigation One',
    icon: <MailOutlined />,
    children: [
      { key: '5', label: 'Option 5' },
      { key: '6', label: 'Option 6' },
      { key: '7', label: 'Option 7' },
      { key: '8', label: 'Option 8' },
    ],
  },
  {
    key: 'sub2',
    label: 'Navigation Two',
    icon: <AppstoreOutlined />,
    children: [
      { key: '9', label: 'Option 9' },
      { key: '10', label: 'Option 10' },
      {
        key: 'sub3',
        label: 'Submenu',
        children: [
          { key: '11', label: 'Option 11' },
          { key: '12', label: 'Option 12' },
        ],
      },
    ],
  },
];
