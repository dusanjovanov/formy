import { Component, createContext, Fragment, ReactNode } from 'react';
import { Field } from './Field';
import { IndexObject, UpdateType } from './types';
import React from 'react';
import { isFunction } from './utils';

type Props = {
  children: (args: API) => any;
  form: any;
  onSubmit: (values: IndexObject, transformedValue: IndexObject) => any;
  context: IndexObject;
};

type GetFieldsStackFilterFn = (name: string) => boolean;

type API = {
  fields: IndexObject<ReactNode>;
  getFieldsStack: (filter?: GetFieldsStackFilterFn) => ReactNode[];
  submitForm: () => void;
  resetForm: () => void;
  focusField: (name: string) => void;
};

export const FormContext = createContext<API>({} as API);

export class Form extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.form = new this.props.form(this);
    this.renderedFields = this.createRenderedFields() as any;
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
      renderedFields[name] = (field as Field).render();
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

  getErrors = () => {
    const errors = 
    return Object.entries(this.fieldRefs).reduce<IndexObject<Error>>(
      (errors, [name, r]) => {
        if (!r.current) return errors;
        errors[name] = r.current.getError();
        return errors;
      },
      {}
    );
  };

  submitForm = () => {
    this.props.onSubmit(this.getValues(), this.getValues());
  };

  resetForm = () => {
    this.form.init(this.props.context);
  };

  componentDidMount() {
    this.form.init(this.props.context);
  }

  createFormProp = () => {
    return { values: this.getValues() };
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

  createFormAPI = () => {
    return {
      fields: this.renderedFields,
      submitForm: this.submitForm,
      focusField: this.focusField,
      getFieldsStack: this.getFieldsStack,
      resetForm: this.resetForm,
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

  focusField = (name: string) => {};

  render() {
    return (
      <FormContext.Provider value={this.createFormAPI()}>
        {this.props.children(this.createFormAPI())}
      </FormContext.Provider>
    );
  }
}
