import { Form } from './Form';
import { Field } from './Field';
import { UpdateReason } from './types';

const field = (component: any, defaultValue?: any) => {
  return new Field(component, defaultValue);
};

export { Form, field, UpdateReason };
