const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
let XMLWriter = require('xml-writer');

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

db.connect(err => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    process.exit(1);
  }
  console.log('Conexión exitosa a la base de datos');
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, 'avatar-' + uniqueSuffix);
  }
});

const upload = multer({ storage });

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('Servidor Express funcionando correctamente');
});

app.post('/register', async (req, res) => {
  const { nombre, apellidos, nickname, contraseña, correo, edad, imc, frecuencia, experiencia } = req.body;

  if (!nombre || !apellidos || !nickname || !contraseña || !correo || !edad || !imc || !frecuencia || !experiencia) {
    return res.status(400).send('Faltan datos requeridos');
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contraseña, salt);
    const query = `
      INSERT INTO usuarios 
        (nombre, apellidos, nickname, contraseña, correo, edad, imc, frecuencia, experiencia)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query,
      [nombre, apellidos, nickname, hashedPassword, correo, edad, imc, frecuencia, experiencia],
      (err, result) => {
        if (err) {
          console.error('ERROR SQL al insertar usuario:', err.sqlMessage || err);
          return res.status(500).send('Error al registrar usuario');
        }
        res.status(200).send('Usuario registrado con éxito');
      }
    );
  } catch (err) {
    res.status(500).send('Error al encriptar la contraseña');
  }
});

app.post('/login', (req, res) => {
  const { nickname, contraseña } = req.body;

  if (!nickname || !contraseña) {
    return res.status(400).send('Faltan credenciales');
  }

  const query = 'SELECT * FROM usuarios WHERE nickname = ?';
  db.query(query, [nickname], async (err, results) => {
    if (err) return res.status(500).send('Error al verificar usuario');
    if (results.length === 0) return res.status(400).send('Usuario no encontrado');

    const user = results[0];
    try {
      const isMatch = await bcrypt.compare(contraseña, user.contraseña);
      if (!isMatch) return res.status(400).send('Credenciales incorrectas');
      res.status(200).json({  // Usar .json() para enviar JSON
        message: 'Inicio de sesión exitoso',
        id: user.id  // Asumiendo que 'id' es el nombre de la columna en tu tabla usuarios
      });
    } catch {
      res.status(500).send('Error al procesar inicio de sesión');
    }
  });
});

app.post('/upload-avatar', (req, res) => {
  upload.single('archivo')(req, res, (err) => {
    if (err) {
      console.error('Error Multer:', err);
      return res.status(500).json({ message: 'Error interno al procesar archivo', error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No se subió ningún archivo' });
    }

    const { nickname } = req.body;
    console.log('Datos recibidos en upload-avatar:', req.body);

    if (!nickname) {
      return res.status(400).json({ message: 'El campo nickname es obligatorio' });
    }

    const fotoPerfilUrl = `uploads/${req.file.filename}`;

    const query = 'UPDATE usuarios SET fotoPerfil = ? WHERE nickname = ?';
    db.query(query, [fotoPerfilUrl, nickname], (err, result) => {
      if (err) {
        console.error('Error al actualizar la foto de perfil en la base de datos:', err);
        return res.status(500).json({ message: 'Error al actualizar la foto de perfil' });
      }

      console.log('Resultado de la consulta SQL:', result);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      res.json({ message: 'Foto de perfil actualizada', fotoPerfil: fotoPerfilUrl });
    });
  });
});


app.get('/usuario/:nickname', (req, res) => {
  const { nickname } = req.params;
  const query = 'SELECT * FROM usuarios WHERE nickname = ?';
  
  db.query(query, [nickname], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error al obtener los datos del usuario' });
    if (result.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(result[0]);
  });
});


app.post('/image/single', upload.single('file'), (req, res) => {
  console.log(req.file);
  if (req.file) {
      const imagePath = `/uploads/${req.file.filename}`;
      res.json({ message: 'Imagen subida con éxito', path: imagePath });
  } else {
    res.status(400).json({ message: 'No se subió ningún archivo' });
  }
});

app.post('/post', (req, res) => {

  const text = req.body.text;
  const userid = req.body.userid;
  const creationdate = req.body.creationdate;
  const imagen = req.body.imagePath;

  db.query("INSERT INTO post(text, creationdate, userid, imagen) VALUES (?, ?, ?, ?)", [text, creationdate, userid, imagen],
  (err, result) => {
      if (err) {
          console.log(err);
      }
      else {
          res.send("Enviado comentado")
      }
  }
  )

})


app.get('/comentarios', (req, res) => {

  db.query("SELECT * FROM post inner join usuarios on post.userid = usuarios.id ORDER BY post.postid DESC;",
  (err, result) => {
      if (err) {
          console.log(err);
      }
      else {
          res.send(result)
      }
  }
  )

})


app.post('/deletecomment', (req, res) => {

  const postid = req.body.postid;

  db.query("DELETE FROM post WHERE postid = (?)", [postid],
  (err, result) => {
      if (err) {
          console.log(err);
      }
      else {
          res.send("Comentario eliminado")
      }
  }
  )

})


app.post('/updatecomment', (req, res) => {

  const postid = req.body.postid;
  const text = req.body.text;

  db.query("UPDATE post SET text = (?) WHERE postid = (?)", [text, postid],
  (err, result) => {
      if (err) {
          console.log(err);
      }
      else {
          res.send("Comentario editado")
      }
  }
  )

})

/*
app.get('/Getrdf', (req, res) => {

  db.query("SELECT * FROM usuarios;",
  (err, result) => {
      if (err) {
          console.log(err);
      }

      const N3 = require('n3');
      const store = new N3.Store();
      
      for (let datos in res)
      {
        store.addQuad(factory.quad(
          factory.namedNode(`https://www.example.com/profile/${res.data.nickname}`),
          factory.namedNode('http://schema.org/name'),
          factory.literal(res.data.nickname)
        ));
        store.addQuad(factory.quad(
          factory.namedNode(`https://www.example.com/profile/${res.data.nickname}`),
          factory.namedNode('http://schema.org/knows'),
          factory.namedNode('https://ruben.verborgh.org/profile/#me')
        ));
      }


      if (!err) {
          res.send(result)
      }
  }
  )

})*/

// Ejercicio 544: Enviar datos en formato XML desde un servidor Node.js usando xml-writer.

app.get('/api/personas', (req, res) => {
        let xml = new XMLWriter();

        xml.startElement('rdf:RDF')
        xml.writeAttribute('xmlns:rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#')
        xml.writeAttribute('xmlns:schema', 'http://schema.org/')
        xml.writeAttribute('xmlns:foaf', 'http://xmlns.com/foaf/0.1/')
        xml.writeAttribute('xmlns:owl', 'http://www.w3.org/2002/07/owl#')
        xml.writeAttribute('xmlns:dcterms', 'http://purl.org/dc/terms/');

        xml.startElement('rdf:Description')
        xml.writeAttribute('rdf:about', 'http://ccallitofit.com/post');

        xml.startElement('schema:about')
        xml.writeAttribute('rdf:resource', 'https://dbpedia.org/page/Publication');
        xml.endElement();

        xml.startElement('schema:about')
        xml.writeAttribute('rdf:resource', 'https://dbpedia.org/page/Exercise');
        xml.endElement();

        xml.endElement();


        xml.startElement('rdf:Description')
        xml.writeAttribute('rdf:about', 'http://ccallitofit.com/login');

        xml.startElement('schema:relatedLink')
        xml.writeAttribute('rdf:resource', 'https://dbpedia.org/page/Login');
        xml.endElement();

        xml.endElement();


        xml.startElement('rdf:Description')
        xml.writeAttribute('rdf:about', 'https://dbpedia.org/page/Login');

        xml.startElement('owl:sameAs')
        xml.writeAttribute('rdf:resource', 'https://es.dbpedia.org/page/Login');
        xml.endElement();

        xml.endElement();


        xml.startElement('rdf:Description')
        xml.writeAttribute('rdf:about', 'http://ccallitofit.com/Home');

        xml.startElement('dcterms:isPartOf')
        xml.writeAttribute('rdf:resource', 'https://dbpedia.org/page/User_interface');
        xml.endElement();

        xml.endElement();


        xml.startElement('rdf:Description')
        xml.writeAttribute('rdf:about', 'https://dbpedia.org/page/Home');

        xml.startElement('owl:sameAs')
        xml.writeAttribute('rdf:resource', 'https://es.dbpedia.org/page/Interfaz_de_usuario');
        xml.endElement();

        xml.endElement();


        xml.startElement('rdf:Description')
        xml.writeAttribute('rdf:about', 'http://ccallitofit.com/Profile');

        xml.startElement('schema:about')
        xml.writeAttribute('rdf:resource', 'https://dbpedia.org/page/User_profile');
        xml.endElement();

        xml.endElement();


        xml.startElement('rdf:Description')
        xml.writeAttribute('rdf:about', 'https://dbpedia.org/page/Schedule');

        xml.startElement('owl:sameAs')
        xml.writeAttribute('rdf:resource', 'https://es.dbpedia.org/page/Horario');
        xml.endElement();

        xml.endElement();


        xml.startElement('rdf:Description')
        xml.writeAttribute('rdf:about', 'https://dbpedia.org/page/Exercise');

        xml.startElement('owl:sameAs')
        xml.writeAttribute('rdf:resource', 'https://es.dbpedia.org/page/Ejercicio_físico');
        xml.endElement();

        xml.endElement();


        xml.endElement();

        res.writeHead(200, {'Content-Type': 'application/xml', 'Access-Control-Allow-Origin': '*'});

        res.end(xml.toString(), 'utf8');
})

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

