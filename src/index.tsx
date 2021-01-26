import { Field as _Field } from './Field';
import { Form } from './Form';
import { UpdateReason } from './types';
import { useFormContext } from './useFormContext';
import { useSubscribe } from './useSubscribe';

const Field = (component: any) => {
  return new _Field(component);
};

export { Form, Field, UpdateReason, useFormContext, useSubscribe };
