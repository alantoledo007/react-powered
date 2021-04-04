# REACT UI MAKER

With react-ui-maker you can make an user interface for any record or data than you needs send. **We talking about from create simple contact form to a CRUD fully functional in matter of minutes**.

`No matter what the REST API 's, react-ui-maker adapts to it.`

**react-ui-maker** uses material-ui by default, to guarantee a clear user interface, but this is completely customizable

In addition to **material-ui**, `react-ui-maker` uses **react-hook-form** with `yup` resolver, avoiding unnecessary re-renders and facilitating form validation.

# Quick example

```
For this example we use nextjs, but it works perfectly with create-next-app
```

We are going to make an simple crud of people.

### Step 1: Make a layout

```javascript
import Provider from 'react-ui-maker';

//material-ui (optional)
import myTheme from '...';

const base_uri = 'https://api.example.com/people';
const api_key = '123-YourApiKey';

//this config will applies to all requests of the record
const recordConfig = {
  name: 'people',
  base_uri,
  headers: {
    Autorization: `Bearer ${api_key}`,
    'Content-Type': 'application/json',
  },
};

export default function PeopleLayout({children}) {
  return (
    <Provider config={recordConfig} theme={myTheme}>
      {children}
    </Provider>
  );
}
```

### Step 2: List & delete your records

```javascript
import PeopleLayout from './PeopleLayout';
import {Reader} from 'react-ui-maker';

/*
dataMap receives the information from the endpoint and return  the
desired structure
*/
const reader = new Reader({dataMap: (data) => data.records});
const ListComponent = reader.list();

export default function PeopleList() {
  return (
    <PeopleLayout>
      <ListComponent
        columns={[
          {
            label: 'Surname',
            dataMap: (item) => item.fields.surname,
          },
          {
            label: 'Actions',
            CustomComponent: (
              {item, destroy}, // Black Magic!
            ) => (
              <button onClick={() => destroy({path: `/${item.id}`})}>
                Delete
              </button>
            ),
          },
        ]}
      />
    </PeopleLayout>
  );
}
```

`This component return a list of people. Easy, true?`

### Step 3: Create an record with yup rules

```javascript
import PeopleLayout from './PeopleLayout';
import {Sender} from 'react-ui-maker';
import * as yup from 'yup';

const schema = yup.object().shape({
  name: yup.string().required('The name is required'),
  surname: yup.string().required('The surname is required'),
});

const sender = new Sender({
  dataMap: (data) => ({fields: data}),
});
const FormCompoment = sender.createForm([
  {name: 'name', label: 'Name'},
  {name: 'surname', label: 'Your surname, please'},
]);

export default function PeopleList() {
  return (
    <PeopleLayout>
      <FormCompoment schema={schema} />
    </PeopleLayout>
  );
}
```

`Ready, we create a form with its respective validations`;

### Step 4: Modify your records

```javascript
import {Sender} from 'react-ui-maker';
import PeopleLayout from './PeopleLayout';
import * as yup from 'yup';
import {useRouter} from 'next/router';

const schema = yup.object().shape({
  name: yup.string().required('is required'),
});

export default function PeopleUpdate() {
  const router = useRouter();
  const {id} = router.query;

  if (!id) return null;

  const sender = new Sender({
    method: 'put',
    path: `/${id}`,
    dataMap: (data) => ({fields: data}),
    reader: {
      // GET request
      path: `/${id}`,
      dataMap: (data) => data.fields,
    },
  });
  const FormCompoment = sender.createForm([
    {name: 'name', label: 'Name'},
    {name: 'surname'},
  ]);

  return (
    <PeopleLayout>
      <FormCompoment schema={schema} />
    </PeopleLayout>
  );
}
```

`This component creates a form with its respective default values and validates the information with yup`

### Step 5: Record details

```javascript
import {useRouter} from 'next/router';
import {Reader} from 'react-ui-maker';
import PeopleLayout from './PeopleLayout';

export default function PeopleShow() {
  const router = useRouter();
  const {id} = router.query;

  if (!id) return null;

  const reader = new Reader({dataMap: (data) => data.fields, path: `/${id}`}); //GET request

  const ShowComponent = reader.show();

  return (
    <PeopleLayout>
      <ShowComponent attributes={[{key: 'name'}, {key: 'surname'}]} />
    </PeopleLayout>
  );
}
```

`FACT: this example is based on the airtable API REST`

# Settings & customization

## Provider component

usage: `<Provider config={config} theme={theme}>{children}</Provider>`

config properties:
| Property | Type | Required | Default value | Observation
|---|:---:|:---:|:---:|:---:|
| name | `String` | false/true | undefined | The record name. Is required if you only use the provider for a record
| base_uri | `String` | **true** | undefined | API REST endpoint |
| headers | `Object` | false | {} | If you applied the headers here they will apply to all requests

## Reader class

This class should be used to read information through a GET request, be it for show details of a record or list records

- usage: new Reader(config)
- methods:
  - show(): return ShowComponent
  - list(): return ListComponent

### config properties:

| Property       |    Type    | Required |         Default value         |               Observation                |
| -------------- | :--------: | :------: | :---------------------------: | :--------------------------------------: |
| path           |  `String`  |  false   |              "/"              |                    -                     |
| dataMap        | `function` |  false   |       `(data) => data`        |                    -                     |
| headers        |  `Object`  |  false   |              {}               | It is combined with the provider headers |
| onRequestError | `function` |  false   | `(error) => throw Error(...)` |        Handles http request error        |

### ShowComponent properties:

| Property        |    Type     | Required | Default value |                                               Observation/Usage                                               |
| --------------- | :---------: | :------: | :-----------: | :-----------------------------------------------------------------------------------------------------------: |
| CustomComponent | `Component` |  false   |   undefined   |                             `({loading, details, destroy}) => <YourComponent />`                              |
| attributes      |   `Array`   |   true   |   [object]    |               Here you must define the attributes you want to display, in the order you prefer.               |
| containerProps  |  `Object`   |  false   |      {}       | These properties will be applied to the container component of ShowComponent: `<Box {...containerProps}> ...` |

#### Properties of attributes items:

| Property |   Type   | Required | Default value |              Observation               |
| -------- | :------: | :------: | :-----------: | :------------------------------------: |
| key      | `String` |   true   |   undefined   | This key refers to the received object |
| label    | `String` |  false   |   undefined   |                   -                    |

### ListComponent properties

| Property        |    Type     | Required | Default value |                                               Observation/Usage                                               |
| --------------- | :---------: | :------: | :-----------: | :-----------------------------------------------------------------------------------------------------------: |
| CustomComponent | `Component` |  false   |   undefined   |                             `({loading, records, destroy}) => <YourComponent />`                              |
| columns         |   `Array`   |   true   |   [object]    |                Here you must define the columns you want to display, in the order you prefer.                 |
| containerProps  |  `Object`   |  false   |      {}       | These properties will be applied to the container component of ShowComponent: `<Box {...containerProps}> ...` |

#### Properties of columns items:

| Property        |    Type     | Required | Default value |                                          Observation/Usage                                          |
| --------------- | :---------: | :------: | :-----------: | :-------------------------------------------------------------------------------------------------: |
| label           |  `String`   |  false   |   undefined   |                                                  -                                                  |
| dataMap         | `function`  |  false   |   undefined   |                This property can return a string or a function that return a string                 |
| CustomComponent | `Component` |  false   |   undefined   | `({item, destroy})=> <YourComponent>` this component is returned (if it exists) before than dataMap |

### Property "destroy" on custom components:

Destroy is a function to delete records. It receives a `config` object as an argument:

| Property       |    Type    | Required |         Default value         |               Observation                |
| -------------- | :--------: | :------: | :---------------------------: | :--------------------------------------: |
| path           |  `String`  |  false   |              "/"              |                    -                     |
| dataMap        | `function` |  false   |       `(data) => data`        |                    -                     |
| headers        |  `Object`  |  false   |              {}               | It is combined with the provider headers |
| onRequestError | `function` |  false   | `(error) => throw Error(...)` |        Handles http request error        |

## Sender class

This class should be used to send information through a POST, PUT or PATCH request, be it a contact form or create/modify records

- Usage: `new Sender(config)`
- methods:
  - setForm(CustomComponent): return createForm([], CustomComponent)
  - createForm([object, ...], CustomComponent): return FormComponent

### config properties:

| Property       |    Type    | Required |         Default value         |                   Observation                   |
| -------------- | :--------: | :------: | :---------------------------: | :---------------------------------------------: |
| method         |  `String`  |  false   |            "post"             |         Can be "post", "put" or "patch"         |
| path           |  `String`  |  false   |              "/"              |                        -                        |
| dataMap        | `function` |  false   |       `(data) => data`        |                        -                        |
| headers        |  `Object`  |  false   |              {}               |    It is combined with the provider headers     |
| onRequestError | `function` |  false   | `(error) => throw Error(...)` |           Handles http request error            |
| reader         |  `object`  |  false   |              {}               | It's equal of `config` property of Reader class |

### CustomComponent (setForm & createForm):

```javascript
({destroy, loading, details, onSubmit, watch, errors, register}) => (
  <YourComponent />
);
```

- `details`: If you supply the "reader" property inside the "config" object, this property will contain the default values of the record.
- `onSubmit`: This function receives the information that you want to send to the endpoint, remember that the information will be processed by dataMap.
- watch: Wacher of form fields (react-hook-form).
- `errors`: Object containing all validation errors by field/name (react-hook-form).
- `register`: This property is inherited from react-hook-form and must be used in the "ref" property of the fields to validate and / or submit them. For more information read the react-hook-form [documentation](https://react-hook-form.com/).

### Properties of fields items (createForms):

| Property     |       Type       | Required |             Default value             |                               Observation                               |
| ------------ | :--------------: | :------: | :-----------------------------------: | :---------------------------------------------------------------------: |
| type         |     `String`     |  false   |                "text"                 |     Supported values: "text", "password", "textarea" or "checkbox"      |
| name         |     `String`     |   true   |               undefined               |                             The field name                              |
| label        |     `String`     |  false   |             name property             |                                    -                                    |
| defaultValue | `String/boolean` |  false   | `defaultValues[name]` (FormComponent) |  This props override value of defaultValues property on FormComponent   |
| rows         |      `Int`       |  false   |                   4                   |                            For textarea only                            |
| helperText   |     `String`     |  false   |            `error.message`            | This property is overridden by any error message related with the field |

### FormComponent properties:

| Property        |     Type     | Required | Default value |                                                                                 Observation/Usage                                                                                  |
| --------------- | :----------: | :------: | :-----------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| HeaderComponent | `Component`  |  false   |   undefined   |                                                                `HeaderComponent={({destroy})=> <YourComponent />}`                                                                 |
| FooterComponent | `Component`  |  false   | Submit button |                                                                `FooterComponent={({destroy})=> <YourComponent />}`                                                                 |
| containerProps  |   `Object`   |  false   |      {}       |                                   These properties will be applied to the container component of ShowComponent: `<Box {...containerProps}> ...`                                    |
| defaultValues   |   `Object`   |  false   |      {}       | `{field_name: "value", ...}` This property is intended to set default values manually, if you used the "reader" property in the class configurator, this property is not required. |
| schema          | `Yup schema` |  false   |   undefined   |                                Here you can set your yup schema, for more information read the yup [documentation](https://github.com/jquense/yup)                                 |

# Thanks!

I hope it helps you and allows you to promote the development of your projects!

:)
