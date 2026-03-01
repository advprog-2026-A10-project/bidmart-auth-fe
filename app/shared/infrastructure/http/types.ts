export type ApiResponse<T> = {
  data: T;
  status: number;
};

export type ApiErrorResponse = {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
};

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type RequestOptions = Omit<RequestInit, "method" | "body"> & {
  params?: Record<string, string | number | boolean | undefined>;
};
