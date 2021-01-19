import { Component } from 'react';
import { Field } from './Field';
import { UpdateType } from './types';

type Props = {
  children: any;
  form: any;
  onSubmit: (values: any) => any;
  context: any;
};

export class Form extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.form = new this.props.form(this);
    this.renderedFields = this.createRenderedFields() as any;
    this.initFields();
  }
  form: any;
  renderedFields: {
    [key: string]: JSX.Element;
  };

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
      [key: string]: JSX.Element;
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

  submitForm = () => {
    this.props.onSubmit(this.getValues());
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

  render() {
    return this.props.children({
      fields: this.renderedFields,
      submitForm: this.submitForm,
    });
  }
}
