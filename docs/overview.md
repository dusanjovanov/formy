---
id: overview
title: Overview
sidebar_label: Overview
---

Formy is a React form library with a very simple API where you put all your form logic in a class.

This is what it looks like:

```ts
class PersonForm {
  firstName = field(TextField);
  lastName = field(TextField);
  fullName = field(TextField);

  init = (context) => {
    this.firstName.value = context.person?.firstName ?? '';
    this.lastName.value = context.person?.lastName ?? '';
    this.fullName.value = context.person
      ? `${context.person.firstName} ${context.person.lastName}`
      : '';
    this.firstName.schema = yup.string().required();
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
```

## Explanation

### Fields

We created our fields as class properties using the `field` function which accepts the component we wish to render for the field.
The component will receive a `field` prop to be able to connect it it with the form.

### Init

`init` is called on mount of the `Form` component and on reset. It receives the `Context` object for external dependencies.
In this case, it would be a Person object from the server.

### Update

`update` is called each time anything related to the form changes. This could be:

- value of a field
- error of a field
- context

In this method you can pass props to your components via `props` object, or you can use it as an effect and set a value to a calculated field as in the example.

It receives the `context` object, the `form` prop, and the `reason` prop. You can use `reason` to know exactly why the update was called, and you can act accordingly.
