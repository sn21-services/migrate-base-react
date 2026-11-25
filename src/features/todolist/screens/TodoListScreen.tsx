import { AppForm, FormField, InputField, useForm } from '@/components/Form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createTodoApi,
  deletedTodoApi,
  TodoListApi,
  updateTodoApi,
} from '../api/todo.api';
import type { TodoFormValues, TodoList } from '../types/todolist.types';
import { Button, Input, message, Select, Switch, Table } from 'antd';
import { useMemo, useState } from 'react';

export const TodoListPage = () => {
  const [form] = useForm<TodoFormValues>();
  const queryClient = useQueryClient();
  const [editingItem, setEditingItem] = useState<TodoList | null>(null);

  const [searchText, setSearchText] = useState<string>('');

  const [statusFilter, setStatusFilter] = useState<
    'all' | 'completed' | 'pending'
  >('all');

  const {
    data: todos,
    isLoading,
    isError,
    refetch,
  } = useQuery<TodoList[]>({
    queryKey: ['todoList'],
    queryFn: async () => {
      const res = await TodoListApi();
      return res.data;
    },
  });

  //Lọc danh sách theo tên và trạng thái (status)

  const filterTodo = useMemo(() => {
    const newTodoList: TodoList[] = todos || [];
    return newTodoList.filter(item => {
      const matchesName = item.jobName
        .toLowerCase()
        .trim()
        .includes(searchText.toLowerCase().trim());

      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'completed'
            ? item.status === true
            : item.status === false;

      return matchesName && matchesStatus;
    });
  }, [todos, searchText, statusFilter]);

  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Job Name',
      dataIndex: 'jobName',
      key: 'jobName',
    },
    {
      title: 'description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'status',
      key: 'status',
      render(data: TodoList) {
        return data.status ? 'Đã hoàn thành' : 'Chưa hoàn thành';
      },
    },
    {
      title: 'Active',
      key: 'Active',
      render(_: unknown, record: TodoList) {
        return (
          <div className="flex gap-2 items-center">
            <Button onClick={() => handleEdit(record)}>Sửa</Button>
            <Button onClick={() => deletedMutation.mutate(record.id)}>
              Xóa
            </Button>
          </div>
        );
      },
    },
  ];

  const createMutation = useMutation({
    mutationFn: (newData: TodoFormValues) => createTodoApi(newData),
    onSuccess: () => {
      message.success('Thêm công việc thành công!');
      queryClient.invalidateQueries({ queryKey: ['todoList'] });
      form.resetFields();
      setStatusFilter('all');
    },
    onError: () => {
      message.error('Thêm công việc thất bại!');
    },
  });

  const handleResetField = () => {
    form.resetFields();
  };

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TodoList> }) =>
      updateTodoApi(id, data),
    onSuccess: () => {
      message.success('Cập nhật công việc thành công!');
      queryClient.invalidateQueries({ queryKey: ['todoList'] });
      setEditingItem(null);
      handleResetField();
      setStatusFilter('all');
    },
    onError: () => {
      message.error('Cập nhật công việc thất bại!');
    },
  });

  const deletedMutation = useMutation({
    mutationFn: (id: string) => deletedTodoApi(id),
    onSuccess: () => {
      message.success('Xóa công việc thành công!');
      queryClient.invalidateQueries({ queryKey: ['todoList'] });
      if (editingItem) {
        setEditingItem(null);
        handleResetField();
      }
    },
    onError: () => {
      message.error('Xóa công việc thất bại!');
    },
  });

  const handleSubmit = (data: TodoFormValues) => {
    const payload: TodoFormValues = {
      jobName: data.jobName.trim(),
      description: data.description?.trim() || '',
      status: Boolean(data.status),
    };
    if (editingItem) {
      updateMutation.mutate({
        id: editingItem.id,
        data: payload,
      });
    } else createMutation.mutate(payload);
  };

  const handleEdit = (record: TodoList) => {
    setEditingItem(record);
    form.setFieldsValue({
      jobName: record.jobName,
      description: record.description,
      status: record.status,
    });
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    form.resetFields();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return (
      <div>
        <p>Lỗi tải dữ liệu</p>
        <button type="button" onClick={() => refetch()}>
          Thử lại
        </button>
      </div>
    );
  }
  return (
    <div className="p-4">
      <h1 className="font-bold text-xl mb-2">TODO LIST</h1>
      <AppForm
        onFinish={handleSubmit}
        form={form}
        initialValues={{
          job_name: '',
          description: '',
          status: false,
        }}
      >
        <FormField
          name={'jobName'}
          label="Job Name"
          rules={[{ required: true, message: 'Vui lòng nhập tên công việc' }]}
        >
          <InputField placeholder="Enter job name" />
        </FormField>
        <FormField name={'description'} label="Description">
          <InputField placeholder="Enter description" />
        </FormField>
        <FormField name={'status'} label="Status" valuePropName="checked">
          <Switch
            checkedChildren="Hoàn thành"
            unCheckedChildren="Chưa hoàn thành"
          />
        </FormField>
        <FormField>
          <div className="flex gap-2">
            <Button
              type="primary"
              htmlType="submit"
              loading={createMutation.isPending || updateMutation.isPending}
            >
              {editingItem ? 'Cập nhật' : 'Tạo'}
            </Button>
            {editingItem && <Button onClick={handleCancelEdit}>Hủy sửa</Button>}
          </div>
        </FormField>
      </AppForm>

      <div className="flex gap-4 items-center ">
        <Input.Search
          className="flex-1"
          placeholder="Tìm kiếm theo tên công việc"
          allowClear
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
        />
        <Select
          className="w-60"
          value={statusFilter}
          onChange={value => setStatusFilter(value)}
          options={[
            { value: 'all', label: 'Tất cả' },
            { value: 'completed', label: 'Hoàn thành' },
            { value: 'spending', label: 'Chưa hoàn thành' },
          ]}
        />
      </div>
      <Table
        rowKey={row => row.id}
        dataSource={filterTodo}
        columns={columns}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default TodoListPage;
