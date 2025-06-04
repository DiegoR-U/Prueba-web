import React, { useState, useEffect } from 'react';
import Imagenes from './assets/Imagenes';
import Axios from 'axios';
import './Post.css';

export function Post () {

    const [text, settext] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const userid = localStorage.getItem('userId');
    const creationdate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const [comentarioslist, setcomentarios] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");

    const add = async() => {
        let imagePath = null;

        if (selectedImage) {
            const formData = new FormData();
            formData.append('file', selectedImage);
        
            try {
                const imageResponse = await Axios.post("http://localhost:5000/image/single", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                
                imagePath = imageResponse.data.path;
            } catch (error) {
                console.error("Error al subir la imagen:", error);
                
                return; // Detenemos la función si hay un error en la subida
            }
        }

        Axios.post("http://localhost:5000/post", {
            text: text,
            creationdate: creationdate,
            userid: userid,
            imagePath: imagePath
        }).then (() => {
            alert("Mensaje enviado");
            settext("");
            setSelectedImage(null);
            getComentarios();
        }).catch((error) => {
            console.error("Error al enviar el comentario:", error);
            alert("Hubo un error al enviar el comentario.");
        });
    }

    
    const getComentarios = () => {
        Axios.get("http://localhost:5000/comentarios").then ((response) => {
            setcomentarios(response.data);
        }).catch((error) => {
            console.error("Error al obtener el comentario:", error);
            alert("Hubo un error al mandar el comentario.");
        });
    }


    const handleDelete = (postid) => {
        Axios.post("http://localhost:5000/deletecomment", {
            postid: postid
        }).then (() => {
            alert("Mensaje eliminado");
            getComentarios();
        }).catch((error) => {
            console.error("Error al eliminar el comentario:", error);
            alert("Hubo un error al eliminar el comentario.");
        });
    }
    
    const handleEdit = (val) => {
        setEditingId(val.postid);
        setEditText(val.text);
    }

    const handleUpdate = (postid) => {
        Axios.post("http://localhost:5000/updatecomment", {
            postid: postid,
            text: editText
        }).then (() => {
            alert("Mensaje editado");
            setEditingId(null);
            setEditText("");
            getComentarios();
        }).catch((error) => {
            console.error("Error al editar el comentario:", error);
            alert("Hubo un error al editar el comentario.");
        });
    }

    useEffect(() => {
        getComentarios();
    }, []);

    return  (
    
    <div className='contenedor'>
        <header className='encabezado'>
            <div id="logo">
                <img src={ Imagenes.img1 } alt="Logo del gimnasio"></img>
                <h2>CcallitoFit</h2>
            </div>

            <div id="recursos">
                <a href=''> Contenido1 </a>
                <a href=''> Contenido2 </a>
            </div>

            <div id="profile">
                <h2> Perfil </h2>
                <img className="user-perfil" src={ Imagenes.img2 } alt="Perfil"></img>
            </div>
        </header>

        <main id="vista">

            <h1> ¡Postea algo en la comunidad! </h1><br></br>

            <div id="Contenido">

                <section className="table">
                    <div className='table-bar'>
                            <h2> Contenidos </h2>
                            <a href="">Contenido1</a><br></br><br></br>
                            <a href="">Contenido2</a><br></br><br></br>
                            <a href="">Contenido3</a><br></br><br></br>
                            <a href="">Contenido4</a><br></br><br></br>
                    </div>
                </section>


                <section className="post">
                    <div id="post">
                        <div className="text-input">
                            <input
                            onChange={(event) => {
                                settext(event.target.value);
                            }}
                            className="comment-input"
                            type="text"
                            name="text"
                            id="texto"
                            placeholder=""
                            ></input>
                            <label for="texto">Pon un comentario</label>
                            <br></br>
                        </div>

                        <div className="file-input">
                            <button className="contenedor-file">
                                🗎 Subir foto
                                <label for="archivo"></label>
                                <input
                                onChange={(event) => {
                                    setSelectedImage(event.target.files[0]);
                                }}
                                className="comment-input"
                                type="file"
                                name="file"
                                id="archivo"
                                ></input>
                            </button>
                            <br></br>
                        </div>


                        <button onClick={add}>Enviar</button>

                    </div>

                    <div id="textpost">
                    <button onClick={getComentarios}>Cargar Comentario</button>
                        {
                            comentarioslist.map((val, key) => {
                                return <div key={key} className='Comentario'>
                                    <br></br>
                                    <div className="head-comment">
                                        { val?.perfil && (
                                            <img id="perfil-comment"
                                                src={`http://localhost:5000${val.perfil}`}
                                                alt={`Perfil de ${val?.nickname}`}
                                            />
                                        )}
                                        { val?.nickname } <br />
                                        { val?.creationdate } <br />
                                    </div>

                                    <div id="body-comment">
                                        {editingId === val.postid ? (
                                            <div>
                                                <input
                                                    type="text"
                                                    value={editText}
                                                    onChange={(e) => setEditText(e.target.value)}
                                                />
                                                <button onClick={() => handleUpdate(val.postid)}>Guardar</button>
                                                <button onClick={() => setEditingId(null)}>Cancelar</button>
                                            </div>
                                        ) : (
                                            <div>
                                                { val?.text } <br />
                                                { val?.imagen && (
                                                    <img id="img-comment"
                                                        src={`http://localhost:5000${val.imagen}`}
                                                        alt={`Imagen adjunta al comentario de ${val?.nickname}`}
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {val.userid == userid && (
                                            <> {}
                                            <button onClick={() => handleDelete(val.postid)}>Borrar</button>
                                            <button onClick={() => handleEdit(val)}>Editar</button>
                                            </>
                                    )}
                                    <br></br>
                                </div>
                            })
                        } 
                        
                    </div>
                </section>
            </div>
        </main>
    </div>
    )
}
