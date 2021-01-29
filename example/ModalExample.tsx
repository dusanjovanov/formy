import * as React from 'react';
import { useState } from 'react';
import 'react-app-polyfill/ie11';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ReactModal from 'react-modal';
import * as yup from 'yup';
import { Field, Form, UpdateReason } from '../.';

export const ModalExample = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const TextField = ({ label, isVisible, field, background }) => {
    if (typeof isVisible === 'boolean' && !isVisible) return null;

    return (
      <div style={{ background }}>
        <h2>{label}</h2>
        <input
          type="text"
          value={field.value ?? ''}
          onChange={(e) => field.onChange(e.target.value)}
          onBlur={field.onBlur}
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

  class PersonForm {
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

    update = (context, reason) => {
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

  const onSubmit = (values) => {
    console.log(values);
  };

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>Open modal</button>
      <div>
        <ReactModal isOpen={isModalOpen} contentLabel="Minimal Modal Example">
          <Form form={PersonForm} onSubmit={onSubmit} context={{}}>
            {({
              fields,
              submitForm,
              getFieldsStack,
              resetForm,
              focusField,
            }) => {
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
          <button onClick={() => setIsModalOpen(false)}>Close</button>
        </ReactModal>
      </div>
    </div>
  );
};
