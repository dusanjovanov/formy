export type IndexObject<T = any> = {
  [key: string]: T;
};

export type UpdateReason = {
  name: string;
  type: UpdateType;
};

export type UpdateType = 'value' | 'error' | 'props';

export type Error = string | undefined;
