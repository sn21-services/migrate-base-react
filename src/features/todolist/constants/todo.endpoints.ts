export const TodoEndPoints = {
  GET_LIST: '/jobs',
  CREATE: '/jobs',
  UPDATE: (id: string) => `/jobs/${id}`,
  DELETE: (id: string) => `/jobs/${id}`,
} as const;
