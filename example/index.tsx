import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Thing } from '../.';
import { Component } from 'react';
import { createRef } from 'react';

const TextField = ({ label, field }) => {
  return (
    <div>
      <h2>{label}</h2>
      <input
        type="text"
        value={field.value}
        onChange={e => field.onChange(e.target.value)}
      />
    </div>
  );
};

class Field {
  constructor(component: any) {
    this.component = component;
  }
  fRef = createRef<FieldComponent>();
  component;
  _value;
  get value() {
    return this._value;
  }
  set value(value: any) {
    this._value = value;
    this.fRef.current?._setState({ value: this.value }, () => {
      this.form.broadcast(name, 'value');
    });
  }

  form;

  defaultValue = '';

  onChange = (value: any) => {
    this.value = value;
  };

  render = () => {
    return <FieldComponent ref={this.fRef} field={this} />;
  };
}

class FieldComponent extends Component<{ field: Field }, { value: any }> {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.field.defaultValue,
    };
  }

  _setState = (newState: any) => {
    this.setState({ ...this.state, ...newState });
  };

  render() {
    return (
      <this.props.field.component
        field={{ value: this.state.value, onChange: this.props.field.onChange }}
      />
    );
  }
}

function Formy<T extends { new (...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    constructor(...args: any[]) {
      super();
      Object.values(this)
        .filter(field => field instanceof Field)
        .forEach(field => (field.form = args[0]));
      this.fields = Object.entries(this)
        .filter(([key, value]) => {
          return value instanceof Field;
        })
        .reduce((f, [name, field]) => {
          f[name] = field;
          return f;
        }, {});
    }
    fields;

    getValues = () => {
      return this.fields.firstName.value;
    };
  };
}

@Formy
class PersonForm {
  firstName = new Field(TextField);
  lastName = new Field(TextField);
  fullName = new Field(TextField);

  init = ({ person }: any) => {
    this.firstName.value = person?.firstName ?? '';
    this.lastName.value = person?.lastName ?? '';
  };

  update = values => {
    console.log(values);
  };
}

class Form extends Component<
  { children: any; form: any; onSubmit: (values: any) => any; context: any },
  { fields: any }
> {
  constructor(props) {
    super(props);
    this.form = new this.props.form(this);
    this.renderedFields = Object.keys(this.form).reduce((f, name) => {
      if (!this.form[name].render) return f;
      f[name] = this.form[name].render();
      return f;
    }, {});
  }
  form;
  renderedFields;

  submitForm = () => {
    console.log(this.form.getValues());
    this.props.onSubmit({});
  };

  componentDidMount() {
    this.form.init(this.props.context);
  }

  broadcast = (name: string, reason: any) => {
    this.form.update(this.form.getValues());
  };

  render() {
    return this.props.children({
      fields: this.renderedFields,
      submitForm: this.submitForm,
    });
  }
}

const App = () => {
  const onSubmit = values => {
    // console.log(values);
  };

  return (
    <div>
      <Form form={PersonForm} onSubmit={onSubmit} context={{}}>
        {({ fields, submitForm }) => {
          return (
            <>
              {fields.firstName}
              {fields.lastName}
              <h1>asdasd</h1>
              <button onClick={() => submitForm()}>Submit</button>
            </>
          );
        }}
      </Form>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
