import { boolean, number, object, string } from 'yup';

export const todoFormSchema = object({
  job_name: string().required('Bạn chưa nhập tên công việc'),
  description: string().required('Bạn chưa nhập mô tả.'),
  status: boolean().required('Bạn chưa tích'),
  id: number(),
});
