// src/components/Home.js

import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <header>
        <div id="logo">
          <img
            src={`${process.env.PUBLIC_URL}/img/logo.png`}
            alt="logo"
            height="100"
          />
        </div>
        <nav className="menu">
          <ul>
            <li><Link to="/home">Inicio</Link></li>
            <li><Link to="/progreso">Progreso</Link></li>
            <li><Link to="/tienda">Tienda</Link></li>
            <li><Link to="/Post">Post</Link></li>
          </ul>
        </nav>
        <div id="perfil">
          <Link to="/profile">Perfil</Link>
          <img
            src={`${process.env.PUBLIC_URL}/img/perfil.jpg`}
            alt="perfil"
            height="100"
          />
        </div>
      </header>

      <section id="ejercicios">
        <h1>Explora tus Rutinas</h1>
        <div className="ejercicio">
          <img src={`${process.env.PUBLIC_URL}/img/ejercicio1.jpg`} alt="Ejercicio 1" />
          <h2>Ejercicio 1</h2>
        </div>
        <div className="ejercicio">
          <img src={`${process.env.PUBLIC_URL}/img/ejercicio2.jpg`} alt="Ejercicio 2" />
          <h2>Ejercicio 2</h2>
        </div>
        <div className="ejercicio">
          <img src={`${process.env.PUBLIC_URL}/img/ejercicio3.jpg`} alt="Ejercicio 3" />
          <h2>Ejercicio 3</h2>
        </div>
        <div className="ejercicio">
          <img src={`${process.env.PUBLIC_URL}/img/ejercicio4.jpg`} alt="Ejercicio 4" />
          <h2>Ejercicio 4</h2>
        </div>
        <div className="ejercicio">
          <img src={`${process.env.PUBLIC_URL}/img/ejercicio5.jpg`} alt="Ejercicio 5" />
          <h2>Ejercicio 5</h2>
        </div>
        <div className="ejercicio">
          <img src={`${process.env.PUBLIC_URL}/img/ejercicio6.jpg`} alt="Ejercicio 6" />
          <h2>Ejercicio 6</h2>
        </div>
      </section>

      <section id="botones">
        <div id="cambioejercicio">
          <Link to="/cambioejercicio">
            <button>CAMBIAR EJERCICIO</button>
          </Link>
        </div>
        <div id="horario">
          <Link to="/horario">
            <button>HORARIO</button>
          </Link>
        </div>
      </section>

      <footer>
        <p>&copy; CcalloCORP</p>
      </footer>
    </div>
  );
};

export default Home;
