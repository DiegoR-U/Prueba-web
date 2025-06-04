import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    nickname: '',
    contraseña: '',
  });
  const [message, setMessage] = useState('');
  const [comentario, setcomentario] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', formData);
      console.log('Inicio de sesión exitoso:', response.data);
      
      const userId = response.data.id;
      localStorage.setItem('userId', userId);
      localStorage.setItem('nickname', formData.nickname);
      
      
      setMessage('Inicio de sesión exitoso');
      navigate('/home');
    } catch (error) {
      console.error('Error en el inicio de sesión:', error.response?.data || error);
      setMessage(error.response?.data || 'Error al iniciar sesión');
    }
  };

  const Getrdf = () => {
          axios.get("http://localhost:5000/Getrdf").then ((response) => {
            setcomentario(response.data);
            console.log(response.data)
        }).catch((error) => {
            console.error("Error al obtener el comentario:", error);
            alert("Hubo un error al mandar el comentario.");
        });
      }

  return (
    <div>
      <header>
        <div id="logo">
          <img src={`${process.env.PUBLIC_URL}/img/logo.png`} alt="logo" />
        </div>
      </header>

      <section id="formulario">
        <form onSubmit={handleSubmit}>
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

          <hr />
          <button type="submit">Iniciar Sesión</button>
        </form>
      </section>

      {message && <p>{message}</p>}

      <section id="registrarse">
        <Link to="/register">
          <button>REGISTRARSE</button>
        </Link>
      </section>

      <section id="lolaso">
          <button onClick={Getrdf}>NDEAH</button>
      </section>

      <footer>
        <p>&copy; CcalloCORP</p>
      </footer>
    </div>
  );
};

export default Login;


