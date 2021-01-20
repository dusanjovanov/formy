import { Form } from './Form';
import { Field } from './Field';
import { UpdateReason } from './types';
import { useFormContext } from './useFormContext';
import { useSubscribe } from './useSubscribe';

const field = (component: any) => {
  return new Field(component);
};

export { Form, field, UpdateReason, useFormContext, useSubscribe };
