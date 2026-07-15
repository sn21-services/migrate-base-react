import { memo } from 'react';
import { Menu } from 'antd';
import { useLocation } from 'react-router';

import { MENU_APP } from '@/constants/menu.constants';

const AppSidebarMenu = () => {
  const { pathname } = useLocation();

  return (
    <section className="w-50 fixed">
      <Menu mode="inline" items={MENU_APP} selectedKeys={[pathname]} />
    </section>
  );
};

export default memo(AppSidebarMenu);
