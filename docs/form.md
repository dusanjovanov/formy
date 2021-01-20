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
