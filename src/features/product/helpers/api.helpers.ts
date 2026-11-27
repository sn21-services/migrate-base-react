import type { ParamsSerializerOptions } from 'axios';

export const CamelParamsSerializer: ParamsSerializerOptions = {
  serialize: (rawParams: Record<string, unknown>) => {
    const searchParams = new URLSearchParams();
    Object.entries(rawParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    return searchParams.toString();
  },
};
