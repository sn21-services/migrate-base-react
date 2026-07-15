import { Outlet } from 'react-router';

import AppHeader from '@/components/AppHeader/AppHeader';
import AppSidebarMenu from '@/components/AppSidebarMenu/AppSidebarMenu';

const DefaultLayout = () => {
  return (
    <div id="default-layout">
      <AppHeader />
      <main className="flex mt-13.75">
        <AppSidebarMenu />
        <section className="flex-1 ml-50">
          <Outlet />
        </section>
      </main>

      <footer>Footer</footer>
    </div>
  );
};

export default DefaultLayout;
