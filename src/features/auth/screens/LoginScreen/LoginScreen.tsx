import {
  AppForm,
  FormField,
  InputField,
  InputPasswordField,
  useForm,
} from '@/components/Form';
import type { TypeLogin } from '../../types/auth.types';
import { Button } from 'antd';
import { useLogin } from '../../services/auth.services';

const LoginScreen = () => {
  const [form] = useForm<TypeLogin>();
  const { mutate: loginMutate, isPending } = useLogin();

  const handleSubmit = (data: TypeLogin) => {
    loginMutate({
      username: data.username.trim(),
      password: data.password.trim(),
      expiresInMins: data.expiresInMins,
    });
    form.resetFields();
  };
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="border rounded-xl p-4">
        <h1 className="font-bold text-2xl text-center mb-2">Login</h1>
        <AppForm
          className="w-100"
          onFinish={handleSubmit}
          form={form}
          layout="vertical"
          initialValues={{
            username: '',
            password: '',
            expiresInMins: 0,
          }}
        >
          <FormField name="username" label="User name:">
            <InputField placeholder="Enter Username" />
          </FormField>
          <FormField name="password" label="Password">
            <InputPasswordField
              type={'password'}
              placeholder="Enter password"
            />
          </FormField>
          <FormField name="expiresInMins" label="ExpiresInMins">
            <InputField type={'number'} placeholder="Enter expiresInMins" />
          </FormField>
          <FormField>
            <div className="flex items-center justify-center">
              <Button type="primary" disabled={isPending} htmlType="submit">
                {isPending ? 'Đang xử lý' : 'Đăng nhập'}
              </Button>
            </div>
          </FormField>
        </AppForm>
      </div>
    </div>
  );
};

export default LoginScreen;
