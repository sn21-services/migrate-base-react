import { UploadOutlined } from '@ant-design/icons';

import {
  AppForm,
  FormField,
  InputField,
  useForm,
  FormAction,
  InputPasswordField,
  CheckboxField,
  CheckboxGroupField,
  RadioGroupField,
  SelectField,
  DatePickerField,
  TimePickerField,
  SwitchField,
  UploadField,
  TextAreaField,
  InputNumberField,
} from '@/components/Form';
import AppButton from '@/components/AppButton/AppButton';
import { userSchema } from '@/features/home/schemas/home.schemas';

const HomeScreen = () => {
  const [form] = useForm<{ email: string }>();

  const handleSubmitForm = (values: { email: string }) => {
    // eslint-disable-next-line no-console
    console.log(values);
  };

  return (
    <div className="m-3 max-w-2xl">
      <AppForm
        onFinish={handleSubmitForm}
        form={form}
        initialValues={{
          email: '',
          password: '',
          hobbies: [],
          confirm: false,
          gender: '',
          address: null,
          birthday: '',
          time: '',
          status: true,
          avatar: [],
          description: '',
          weight: '',
        }}
        schema={userSchema}
      >
        <FormField label="Email" name="email" layout="vertical">
          <InputField placeholder="Email" />
        </FormField>

        <FormField label="Password" name="password" layout="vertical">
          <InputPasswordField placeholder="Password" />
        </FormField>

        <FormField label="Hobbies" name="hobbies" layout="vertical">
          <CheckboxGroupField
            options={[
              { label: 'Đá bóng', value: '1' },
              { label: 'Cầu lông', value: '2' },
            ]}
          />
        </FormField>

        <FormField label="Gender" name="gender" layout="vertical">
          <RadioGroupField
            options={[
              { label: 'Name', value: 'MALE' },
              { label: 'Nữ', value: 'FEMALE' },
            ]}
          />
        </FormField>

        <FormField label="Address" name="address" layout="vertical">
          <SelectField
            options={[
              { label: 'Hà Nội', value: 'hanoi' },
              { label: 'Hồ Chí Minh', value: 'hcm' },
            ]}
            placeholder="Chọn địa chỉ"
            showSearch
          />
        </FormField>

        <FormField label="Birthday" name="birthday" layout="vertical">
          <DatePickerField
            placeholder="Chọn ngày sinh nhật"
            className="w-full"
          />
        </FormField>

        <FormField label="Time" name="time" layout="vertical">
          <TimePickerField
            placeholder="Chọn thời gian"
            className="w-full"
            use12Hours
          />
        </FormField>

        <FormField label="Weight" name="weight" layout="vertical">
          <InputNumberField placeholder="Nhập cân nặng" />
        </FormField>

        <FormField label="Status" name="status" layout="vertical">
          <SwitchField />
        </FormField>

        <FormField
          label="Avatar"
          name="avatar"
          layout="vertical"
          valuePropName="fileList"
          getValueFromEvent={e => e?.fileList}
        >
          <UploadField listType="picture" maxCount={1}>
            <AppButton icon={<UploadOutlined />}>Click to Upload</AppButton>
          </UploadField>
        </FormField>

        <FormField label="Description" name="description" layout="vertical">
          <TextAreaField placeholder="Nhập mô tả" />
        </FormField>

        <FormField
          label="Confirm"
          name="confirm"
          layout="vertical"
          valuePropName="checked"
        >
          <CheckboxField />
        </FormField>

        <FormAction>
          <AppButton type="primary" htmlType="submit">
            Submit
          </AppButton>
        </FormAction>
      </AppForm>
    </div>
  );
};

export default HomeScreen;
