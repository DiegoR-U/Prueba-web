import React from 'react';
import Imagenes from './assets/Imagenes';

export function Friends () {

    return  (
    
        <div className='contenedor1'>
            <header id="Prueba">
                <div id="logo">
                    <img src={ Imagenes.img1 } alt="Logo del gimnasio"></img>
                    <a href=''>X X X X</a>
                    <a href=''>X X X X</a>
                    <div id="perfil">
                    <h2>Perfil</h2>
                    <img src={ Imagenes.img2 } alt="Perfil"></img>
                    </div>
                </div>
            </header>

            <h1> AMIGOS </h1>

            <div className='Contenido'>
                <section className="table_bar">

                    <h2> Contenidos </h2>
                    <a href="">Contenido1</a>
                    <a href="">Contenido2</a>
                    <a href="">Contenido3</a>
                    <a href="">Contenido4</a>

                </section>


                <section className="post">
                    <div>
                        <input className="comment-inp" type="text" placeholder='Buscar amigo'></input> <br></br>
                        <div id='5'>
                            <img src={ Imagenes.img2 } alt="Logo del gimnasio"></img>
                            <p>Usuario1</p><br></br>
                            <img src={ Imagenes.img2 } alt="Logo del gimnasio"></img>
                            <p>Usuario2</p><br></br>
                            <img src={ Imagenes.img2 } alt="Logo del gimnasio"></img>
                            <p>Usuario3</p><br></br>
                            <img src={ Imagenes.img2 } alt="Logo del gimnasio"></img>
                            <p>Usuario4</p><br></br>
                            <br></br>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}
