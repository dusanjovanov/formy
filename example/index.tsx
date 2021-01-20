import * as React from 'react';
import 'react-app-polyfill/ie11';
import * as ReactDOM from 'react-dom';
import { field, Form, UpdateReason } from '../.';
import * as yup from 'yup';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';

const TextField = ({ label, isDisabled, field }) => {
  return (
    <div>
      <h2>{label}</h2>
      <input
        type="text"
        value={field.value ?? ''}
        onChange={(e) => field.onChange(e.target.value)}
        onBlur={field.onBlur}
        disabled={isDisabled}
        ref={field.focusRef}
      />
      {field.error}
    </div>
  );
};

class PersonForm {
  firstName = field(TextField);
  lastName = field(TextField);
  fullName = field(TextField);

  init = ({ person }) => {
    this.firstName.value = person?.firstName ?? '';
    this.lastName.value = person?.lastName ?? '';
    this.fullName.value = person
      ? `${person.firstName} ${person.lastName}`
      : '';
    this.firstName.schema = yup.string().required();
    this.lastName.schema = yup.string().required();
    // this.lastName.validate = (value) => {
    //   if (typeof value !== 'string' || value.length === 0) {
    //     return 'Required';
    //   }
    // };
  };

  update = (context, form, reason) => {
    this.firstName.props = {
      label: 'First name',
    };
    this.lastName.props = {
      label: 'Last name',
    };
    this.fullName.props = {
      label: 'Full name',
      isDisabled: true,
    };
    this.calculateFullName(reason);
  };

  calculateFullName = (reason: UpdateReason) => {
    if (
      reason.type === 'value' &&
      (reason.name === 'firstName' || reason.name === 'lastName')
    ) {
      this.fullName.value = `${this.firstName.value} ${this.lastName.value}`;
    }
  };
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const getPerson = async () => {
  await sleep(500);
  return {
    firstName: 'Dusan',
    lastName: 'Jovanov',
  };
};

const App = () => {
  const [person, setPerson] = useState<any>(null);
  const formRef = useRef<Form>(null);

  useEffect(() => {
    (async () => {
      const person = await getPerson();
      setPerson(person);
    })();
  }, []);

  useEffect(() => {
    if (person) {
      if (!formRef.current) return;
      formRef.current.resetForm();
    }
  }, [person]);

  const onSubmit = (values) => {
    console.log(values);
  };

  const context = {
    person,
  };

  return (
    <div>
      <Form
        form={PersonForm}
        onSubmit={onSubmit}
        context={context}
        ref={formRef}
      >
        {({ fields, submitForm, getFieldsStack, resetForm, focusField }) => {
          return (
            <>
              {fields.firstName}
              {fields.lastName}
              {fields.fullName}
              <button onClick={() => submitForm()}>Submit</button>
              <button onClick={() => resetForm()}>Reset</button>
            </>
          );
        }}
      </Form>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
