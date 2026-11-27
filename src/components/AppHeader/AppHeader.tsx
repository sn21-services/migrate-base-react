import { Link } from 'react-router';

import { AuthPathsEnum, useAuthStore } from '@/features/auth';
import { TodoPath } from '@/features/todolist/constants/todo.paths';
import { Button } from 'antd';

const AppHeader = () => {
  const token = useAuthStore(s => s.accessToken);
  const { logout } = useAuthStore();
  return (
    <header className="border-b border-gray-100 p-3 fixed top-0 left-0 right-0 z-50 bg-white flex items-center justify-between">
      <section className="flex items-center gap-3">
        <img
          src="https://hcmfpt.vn/vnt_upload/about/FPT_Telecom_logo.svg"
          alt="log-fpt"
          className="h-7.5"
        />
        <span className="uppercase font-semibold">Loyalty management</span>
      </section>

      <section>
        <div className="flex gap-4 items-center">
          {token ? (
            <Button onClick={logout}>Logout</Button>
          ) : (
            <Link className="text-[14px]" to={AuthPathsEnum.LOGIN}>
              Login
            </Link>
          )}
          <Link
            className="text-sm inline-block py-1 px-7 rounded-lg bg-slate-950 text-white"
            to={TodoPath.TODO}
          >
            TodoList
          </Link>
        </div>
      </section>
    </header>
  );
};

export default AppHeader;
