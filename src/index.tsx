import { Form } from './Form';
import { Field as _Field } from './Field';
import { UpdateReason } from './types';
import { useFormContext } from './useFormContext';
import { useSubscribe } from './useSubscribe';
import { IForm } from './IForm';

const Field = (component: any) => {
  return new _Field(component);
};

export { Form, Field, UpdateReason, useFormContext, useSubscribe, IForm };
