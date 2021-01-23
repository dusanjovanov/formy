import { FormProp, IndexObject, UpdateReason } from './types';

export interface IForm<Context = IndexObject> {
  init: (context: Context) => void;
  update: (context: Context, form: FormProp, reason: UpdateReason) => void;
  [key: string]: any;
}
