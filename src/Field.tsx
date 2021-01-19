import { createRef } from 'react';
import { FieldComponent } from './FieldComponent';
import React from 'react';
import { Form } from './Form';
import { Error, IndexObject, UpdateType } from './types';
import * as yup from 'yup';

export class Field {
  constructor(component: any, defaultValue?: any) {
    this.component = component;
    this.defaultValue = defaultValue;
  }
  name: string = '';
  fieldRef = createRef<FieldComponent>();
  component: any;
  prevValue: any;
  _value: any;
  get value() {
    return this._value;
  }
  set value(value: any) {
    this.prevValue = this.value;
    this._value = value;
    this.updateFieldState({ value: this.value }, 'value');
    this.validateField();
  }
  prevError: Error;
  _error: Error;
  get error() {
    return this._error;
  }
  set error(error: Error) {
    this.prevError = this.error;
    this._error = error;
    if (this.prevError !== this.error) {
      this.updateFieldState({ error: this.error }, 'error');
    }
  }
  _props: IndexObject = {};
  get props() {
    return this._props;
  }
  set props(props: IndexObject) {
    const oldProps = this.props;
    this._props = { ...oldProps, ...props };
    if (JSON.stringify(oldProps) !== JSON.stringify(this.props)) {
      this.updateFieldState({ ...this.props }, 'props');
    }
  }
  _schema: yup.AnySchema | undefined;
  get schema() {
    return this._schema;
  }
  set schema(schema: yup.AnySchema | undefined) {
    if (!schema) return;
    this._schema = schema;
  }

  validateField = () => {
    if (this.schema) {
      this.schema
        .validate(this.value)
        .then(() => {
          this.error = undefined;
        })
        .catch((err) => {
          this.error = err.errors[0];
        });
    }
  };

  updateFieldState = (state: IndexObject, updateType: UpdateType) => {
    if (!this.fieldRef.current) return;
    this.fieldRef.current._setState(state, () => {
      if (!this.form) return;
      this.form.broadcast(this.name, updateType);
    });
  };

  defaultValue: any;
  form?: Form;

  onChange = (value: any) => {
    this.value = value;
  };

  onBlur = () => {
    this.validateField();
  };

  render = () => {
    return <FieldComponent ref={this.fieldRef} field={this} />;
  };
}
