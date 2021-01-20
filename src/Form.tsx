import { Component, createContext, Fragment, ReactNode } from 'react';
import { Field } from './Field';
import {
  API,
  Error,
  FormProp,
  GetFieldsStackFilterFn,
  IndexObject,
  SubscribeCallback,
  UpdateType,
} from './types';
import React from 'react';
import { isFunction } from './utils';

type Props = {
  children: (args: API) => any;
  form: any;
  onSubmit: (values: IndexObject, transformedValue: IndexObject) => any;
  context: IndexObject;
};

export const FormContext = createContext<API>({} as API);

export class Form extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.form = new this.props.form(this);
    this.renderedFields = this.createRenderedFields();
    this.initFields();
  }
  form: any;
  renderedFields: IndexObject<ReactNode>;

  initFields = () => {
    this.getFieldsEntries().forEach(([name, field]) => {
      field.form = this;
      field.name = name;
    });
  };

  getFieldsEntries = () => {
    return Object.entries(this.form).filter(([_, value]) => {
      return value instanceof Field;
    }) as [string, Field][];
  };

  createRenderedFields = () => {
    const renderedFields: {
      [key: string]: ReactNode;
    } = {};
    for (const [name, field] of this.getFieldsEntries()) {
      renderedFields[name] = field.render();
    }
    return renderedFields;
  };

  getValues = () => {
    const values: { [key: string]: any } = {};
    for (const [name, field] of this.getFieldsEntries()) {
      values[name] = field.value;
    }
    return values;
  };

  getPreviousValues = () => {
    const previousValues: { [key: string]: any } = {};
    for (const [name, field] of this.getFieldsEntries()) {
      previousValues[name] = field.prevValue;
    }
    return previousValues;
  };

  getErrors = () => {
    const errors: IndexObject<Error> = {};
    for (const [name, field] of this.getFieldsEntries()) {
      if (field.error === undefined) continue;
      errors[name] = field.error;
    }
    return errors;
  };

  getPreviousErrors = () => {
    const previousErrors: { [key: string]: any } = {};
    for (const [name, field] of this.getFieldsEntries()) {
      if (field.prevError === undefined) continue;
      previousErrors[name] = field.prevError;
    }
    return previousErrors;
  };

  getTransformedValues = () => {
    const transformedValues: { [key: string]: any } = {};
    for (const [name, field] of this.getFieldsEntries()) {
      if (field.transform && isFunction(field.transform)) {
        transformedValues[name] = field.transform(field.value);
      } else {
        transformedValues[name] = field.value;
      }
    }
    return transformedValues;
  };

  validateAllFields = () => {
    this.getFieldsEntries().forEach(([_, field]) => {
      field.validateField();
    });
  };

  isValid = () => {
    return JSON.stringify(this.getErrors()) === JSON.stringify({});
  };

  submitForm = () => {
    this.validateAllFields();
    if (this.isValid()) {
      this.props.onSubmit(this.getValues(), this.getTransformedValues());
    }
  };

  resetForm = () => {
    this.form.init(this.props.context);
  };

  componentDidMount() {
    this.form.init(this.props.context);
  }

  createFormProp = (): FormProp => {
    return {
      values: this.getValues(),
      errors: this.getErrors(),
      previousValues: this.getPreviousValues(),
      previousErrors: this.getPreviousErrors(),
    };
  };

  createReason = (name: string, updateType: UpdateType) => ({
    name,
    type: updateType,
  });

  broadcast = (name: string, updateType: UpdateType) => {
    this.form.update(
      this.props.context,
      this.createFormProp(),
      this.createReason(name, updateType)
    );
  };

  createFormAPI = (): API => {
    return {
      fields: this.renderedFields,
      submitForm: this.submitForm,
      focusField: this.focusField,
      getFieldsStack: this.getFieldsStack,
      resetForm: this.resetForm,
      subscribe: this.subscribe,
      getValues: this.getValues,
      getErrors: this.getErrors,
      getIsValid: this.isValid,
    };
  };

  getFieldsStack = (filter?: GetFieldsStackFilterFn) => {
    return this.getFieldsEntries()
      .filter(([name]) => {
        if (filter && isFunction(filter)) {
          return filter(name);
        }
        return true;
      })
      .map(([name]) => {
        return <Fragment key={name}>{this.renderedFields[name]}</Fragment>;
      });
  };

  focusField = (name: string) => {
    const field = this.form[name];
    if (!field) return;
    field.focusField();
  };

  subscribers: SubscribeCallback[] = [];

  subscribe = (cb: SubscribeCallback) => {
    this.subscribers.push(cb);
  };

  render() {
    return (
      <FormContext.Provider value={this.createFormAPI()}>
        {this.props.children(this.createFormAPI())}
      </FormContext.Provider>
    );
  }
}
