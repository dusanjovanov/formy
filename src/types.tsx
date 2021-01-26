import { ReactNode } from 'react';
import { Field } from './Field';

export type IndexObject<T = any> = {
  [key: string]: T;
};

export type UpdateReason = {
  name: string;
  type: UpdateType;
};

export type UpdateType = 'value' | 'error' | 'props' | 'context' | 'mount';

export type Error = string | undefined;

export type ValidateFn = (value: any) => undefined | string | Promise<any>;

export type FormProp = {
  values: IndexObject;
  errors: IndexObject<Error>;
  previousValues: IndexObject;
  previousErrors: IndexObject;
};

export type SubscribeCallback = (args: FormProp) => void;

export type GetFieldsStackFilterFn = (field: Field) => boolean;

export type API = {
  fields: IndexObject<ReactNode>;
  getFieldsStack: (filter?: GetFieldsStackFilterFn) => ReactNode[];
  submitForm: (args?: IndexObject) => void;
  resetForm: () => void;
  focusField: (name: string) => void;
  subscribe: (cb: SubscribeCallback) => void;
  getValues: () => IndexObject;
  getErrors: () => IndexObject;
  getIsValid: () => boolean;
  setValue: (name: string, value: any) => void;
  getFieldsArray: () => Field[];
};

export type TransformFn = (value: any) => any;
