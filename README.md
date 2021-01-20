# Formy

![Formy](https://github.com/dusanjovanov/formy/blob/master/logo_small.png 'Formy')

## Install

```bash
npm i @formx/formy
```

## Create your form class

```ts
import { IForm } from '@formx/formy';

class PersonForm implements IForm {
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

## Create your component

```tsx
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
```

### Explanation

There is a special prop passed to you components called `field`.
It includes following things:

- value
- onChange
- onBlur
- error
- focusRef (should be passed to something with a`focus()` method.

Every other prop is arbitrary.

These props are passed with `this.fieldName.props = {}` in the class.

## Wire everything up

```tsx
import { Form } from '@formx/formy';

const App = () => {
  const [person, setPerson] = useState < any > null;
  const formRef = useRef < Form > null;

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
        {({ fields, submitForm, fields, resetForm, focusField }) => {
          return (
            <>
              {fields.firstName}
              {fields.lastName}
              {fields.fullName}
              <br />
              <br />
              <button onClick={() => submitForm()}>Submit</button>
              <button onClick={() => resetForm()}>Reset</button>
            </>
          );
        }}
      </Form>
    </div>
  );
};
```

### Explanation

We're using the Form component and we're passing it 4 things:

- `form` - Your form class
- `onSubmit` - Function that will be called when you submit if all fields are valid. It will be called with values and transformed values.
- `context` - External dependencies. In this case, it's a person object that we get from the server.
- `ref`- Ref to the Form component. We use this to reset the form from the outside when the person object arrives from the server.

