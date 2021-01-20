import { Form } from './Form';
import { Field } from './Field';
import { UpdateReason } from './types';

const field = (component: any) => {
  return new Field(component);
};

export { Form, field, UpdateReason };
