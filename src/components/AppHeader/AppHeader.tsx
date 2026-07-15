import { Link } from 'react-router';

import { AuthPathsEnum } from '@/features/auth';

const AppHeader = () => {
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
        <Link className="text-[14px]" to={AuthPathsEnum.LOGIN}>
          Login
        </Link>
      </section>
    </header>
  );
};

export default AppHeader;
