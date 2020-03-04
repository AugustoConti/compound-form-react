import React from 'react';

import Form from './Form';
import FormField from './FormField';

const SelectRoom = ({ value, onChange }) => {
  return (
    <div>
      <ul>
        {value.map(r => (
          <li key={r}>{r}</li>
        ))}
      </ul>
      <button onClick={() => onChange({ target: { value: ['asd'] } })}>Add</button>
    </div>
  );
};

const App = () => {
  const initialValue = { nombre: 'Augusto', apellido: 'Conti', selectRoom: [] };
  const handleSubmit = ({ value, touched }) =>
    console.log(JSON.stringify({ value, touched }, null, 2));

  return (
    <div className="m-4">
      <Form
        onSubmit={handleSubmit}
        initialValue={initialValue}
        messages={{ required: 'Requerido!!', invalid: 'Inválido!' }}
      >
        <FormField
          name="nombre"
          label="Nombre"
          type="text"
          validate={value => value.length < 3 && 'menor a 3 caracteres'}
        />
        <FormField name="apellido" label="Apellido" type="text" help="ayuda" required />
        <FormField name="password" label="Contraseña" type="password" help="constrase" />
        <FormField name="email" label="Email" type="email" help="mail" required />
        <FormField name="description" label="Descripcion" type="textarea" help="area" />
        <FormField name="check" label="check" type="checkbox" />
        <FormField name="selectRoom" label="Room" component={SelectRoom} />
      </Form>
    </div>
  );
};

export default App;
