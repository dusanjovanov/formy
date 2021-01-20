---
id: form
title: Form
sidebar_label: Form
---

## Props

### `form`

Your form class. Should implement `init` and `update`, and can implement any additional methods and fields you require for your logic.

### `context: {[key:string]: any}`

These are your external dependencies. Could be:

- an object from the server
- some state you have
- t function from `i18next` package
- `redux dispatch`
- ...etc

### `onSubmit: (values: {[key:string]: any}, transformedValues: {[key:string]: any}) => void`

This gets called when you submit the form, and all fields are valid (i.e. the `errors` state is an empty object)

## Return props

Things you get in function as prop (`children` function) and through `useFormContext`.

### `fields: {[name: string]: ReactNode}`

This is an object that contains all your fields already rendered for you to place at your will. This is done so you can have whatever form layout you want.

### `submitForm: () => void`

Function to trigger submit.

### `resetForm: () => void`

Function to trigger reset. When you call this function, the init method from your class will be called.

### `getFieldsStack: (filter?: (name: string) => boolean) => ReactNode[]`

Function to get an array of rendered fields so you don't have to place every field individually.
You get a filter function if you want to place some fields differently.

### `getValues: () => {[key: string]: any}`

### `getErrors: () => {[key: string]: string}`

### `getIsValid: () => boolean`

Get if form is valid (i.e. the errors object is empty)

### `subscribe: (cb: (form: FormProp, reason: UpdateReason) => void) => void;`

You can subscribe outside of the form to every change (value, error, context)

### `focusField: (name: string) => void;`

Fmperatively focus a field. This depends on `focusRef` being passed to something with a `focus` method in your component.
