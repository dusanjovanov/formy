---
id: iform
title: IForm
sidebar_label: IForm
---

## Methods

### `init: (context: {[key: string]: any}) => void`

Called on form mount and on reset. You can initialize the fields values here, or anything else you want to run on mount and reset.

### `update: (context: {[key: string]: any}, form: FormProp, reason: UpdateReason) => void`

Called every time something changes in the form. Examples:

- values
- errors
- context
- ...etc

You can use this to:

- set props to components
- imperative effects
- anything you want really

⚠️ Just be careful not to cause an infinite loop! If you're changing the value of a field always check if the reason is not that field's value being changed.
