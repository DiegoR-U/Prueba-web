import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    nickname: '',
    contraseña: '',
    correo: '',
    edad: '',
    imc: '',
    frecuencia: '',
    experiencia: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/register', formData);
      console.log('Respuesta del backend:', response.data);
      setMessage('Usuario registrado con éxito');
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      setMessage('Error al registrar usuario');
    }
  };

  return (
    <div>
      <header>
        <div id="logo">
          <img src={`${process.env.PUBLIC_URL}/img/logo.png`} alt="logo" />
        </div>
      </header>

      <section id="formulario">
        <form onSubmit={handleSubmit}>
          <label>Nombre:</label><br />
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ingrese su Nombre"
            required
          /><br />

          <label>Apellidos:</label><br />
          <input
            type="text"
            name="apellidos"
            value={formData.apellidos}
            onChange={handleChange}
            placeholder="Ingrese sus Apellidos"
            required
          /><br />

          <label>Nickname:</label><br />
          <input
            type="text"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            pattern="[a-zA-Z0-9]+"
            placeholder="Ingrese su Nickname"
            required
          /><br />

          <label>Contraseña:</label><br />
          <input
            type="password"
            name="contraseña"
            value={formData.contraseña}
            onChange={handleChange}
            placeholder="Ingrese su Contraseña"
            required
          /><br />

          <label>E-mail:</label><br />
          <input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            placeholder="Ingrese su E-mail"
            required
          /><br />

          <label>Edad:</label><br />
          <input
            type="number"
            name="edad"
            value={formData.edad}
            onChange={handleChange}
            min="18"
            placeholder="Ingrese su Edad"
            required
          /><br />

          <label>IMC:</label><br />
          <input
            type="number"
            name="imc"
            value={formData.imc}
            onChange={handleChange}
            placeholder="Ingrese su IMC"
            required
          /><br />

          <label>Frecuencia:</label><br />
          <input
            type="number"
            name="frecuencia"
            value={formData.frecuencia}
            onChange={handleChange}
            min="3"
            placeholder="Ingrese su Frecuencia"
            required
          /><br />

          <label>Experiencia (1-3):</label><br />
          <input
            type="number"
            name="experiencia"
            value={formData.experiencia}
            onChange={handleChange}
            min="1"
            max="3"
            placeholder="Ingrese su Experiencia"
            required
          /><br />

          <hr />
          <button type="submit">REGISTRARSE</button>
        </form>
      </section>

      {message && <p>{message}</p>} // error o exito

      <section id="iniciosesion">
        <a href="/login">
          <button>INICIA SESION</button>
        </a>
      </section>

      <footer>
        <p>&copy; CcalloCORP</p>
      </footer>
    </div>
  );
};

export default Register;

