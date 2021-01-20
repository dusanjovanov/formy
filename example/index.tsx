import * as React from 'react';
import 'react-app-polyfill/ie11';
import * as ReactDOM from 'react-dom';
import { Field, Form, IForm, UpdateReason } from '../.';
import * as yup from 'yup';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TextField = ({ label, isVisible, field, background }) => {
  if (typeof isVisible === 'boolean' && !isVisible) return null;

  return (
    <div style={{ background }}>
      <h2>{label}</h2>
      <input
        type="text"
        {...field}
        value={field.value ?? ''}
        onChange={(e) => field.onChange(e.target.value)}
        ref={field.focusRef}
      />
      {field.error}
    </div>
  );
};

const DateField = ({ label, field }) => {
  return (
    <div>
      <h2>{label}</h2>
      <DatePicker
        selected={field.value}
        onChange={field.onChange}
        onBlur={field.onBlur}
        ref={field.focusRef}
      />
      {field.error}
    </div>
  );
};

const CheckboxField = ({ label, field, background }) => {
  return (
    <div style={{ background }}>
      <h2>{label}</h2>
      <input
        type="checkbox"
        onChange={(e) => field.onChange(e.target.checked)}
        onBlur={field.onBlur}
        checked={field.value ?? false}
        ref={field.focusRef}
      />
    </div>
  );
};

class PersonForm implements IForm {
  firstName = Field(TextField);
  lastName = Field(TextField);
  fullName = Field(TextField);
  dateOfBirth = Field(DateField);
  isEmployed = Field(CheckboxField);
  companyName = Field(TextField);

  init = ({ person }) => {
    this.firstName.value = person?.firstName ?? '';
    this.lastName.value = person?.lastName ?? '';
    this.dateOfBirth.value = person ? new Date(person.dateOfBirth) : null;
    this.isEmployed.value = false;
    this.fullName.value = person
      ? `${person.firstName} ${person.lastName}`
      : '';
    this.firstName.schema = yup.string().required();
    this.dateOfBirth.transform = (value) =>
      value ? value.toISOString() : null;
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
    this.dateOfBirth.props = {
      label: 'Date of birth',
    };
    this.isEmployed.props = {
      label: 'Is employed',
    };
    this.companyName.props = {
      label: 'Company name',
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
    dateOfBirth: new Date().toISOString(),
    isEmployed: false,
    companyName: null,
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

  const onSubmit = (values, transformedValues) => {
    console.log(values, transformedValues);
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
              {getFieldsStack()}
              <br />
              <br />
              <button onClick={() => submitForm()}>Submit</button>
              <button onClick={() => resetForm()}>Reset</button>
              <button onClick={() => focusField('lastName')}>
                Focus field
              </button>
            </>
          );
        }}
      </Form>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
