export type TodoList = {
  id: string;
  jobName: string;
  description: string;
  status: boolean;
};

export type TodoFormValues = Omit<TodoList, 'id'>;
