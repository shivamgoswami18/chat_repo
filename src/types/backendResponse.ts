export type BackendResp<T = unknown> = {
  statusCode: number;
  status: string;
  messageKey: string;
  message: string;
  data?: T;
};