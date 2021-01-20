import { FormProp, IndexObject, UpdateReason } from './types';

export interface IForm {
  init: (context: IndexObject) => void;
  update: (context: IndexObject, form: FormProp, reason: UpdateReason) => void;
  [key: string]: any;
}
