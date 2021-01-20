---
id: field
title: Field
sidebar_label: Field
---

## Props

### `value: any`

### `error: any`

### `schema?: Yup.AnySchema`

Used for validation. Needs to be a schema from the `yup` library.

### `validate?: (value: any) => undefined | string | Promise<any>`

Should return a string or a Promise containing a string with the error message if there's an error, otherwise should return undefined.

### `props: {[key: string]: any}`

An object with anything that you wish to pass to your component. Examples:

- label
- style
- renderRightButton
- renderLabel
- ...etc

When you set the props, the library diffs the new props object with the previous one, and updates only if they're different.

### `transform?: (value: any) => any`

This is used when submitting the form, and the value it returns will be present in the second argument on `onSubmit` - `transformedValues`.
You can use this to define transformations for fields in one place, instead of doing them in `onSubmit`.

## Methods

### `validateField: () => void`

You can use this to imperatively validate a field.

### `focusField: () => void`

Imperatively focus a field. This depends on `focusRef` being passed to something with a `focus` method in your component.
