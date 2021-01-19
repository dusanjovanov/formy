import { Component } from 'react';
import { Field } from './Field';
import React from 'react';
import { Error } from './types';

type Props = { field: Field };

export class FieldComponent extends Component<
  Props,
  { value: any; error: Error; [key: string]: any }
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      value: this.props.field.defaultValue,
      error: undefined,
    };
  }

  _setState = (newState: any, cb: () => void) => {
    this.setState({ ...this.state, ...newState }, cb);
  };

  render() {
    return (
      <this.props.field.component
        {...this.state}
        field={{
          value: this.state.value,
          error: this.state.error,
          onChange: this.props.field.onChange,
          onBlur: this.props.field.onBlur,
        }}
      />
    );
  }
}
