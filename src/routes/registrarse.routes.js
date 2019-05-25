const express = require('express');
const { client, mongodb }  = require('../database');
const router = express.Router();

var multer  = require('multer')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/public/avatar')
  },
  filename: function (req, file, cb) {
      cb(null, file.originalname);        
  }
})

var upload = multer({ storage: storage })

// Ruta registrarse renderizo los form 
router.get("/registrarse", function(req, res) {
    res.render("registrar");
});

//Ruta registrarse form - obtengo los datos recibidos de los <form>
router.post("/registrarusuario", upload.single('avatar'), function(req, res) {

  console.log(req.file.filename);

// guardo todos los datos recibidos en una variable
  const reqBodys = {
    usuario: req.body.usuario.toUpperCase(),
    email: req.body.email.toUpperCase(),
    password: req.body.password,
    avatar: req.file.filename
  };

  // conecto al cliente
  client.connect(function(error, client) {
    // ingreso la database que usare
    const db = client.db("dbPrincipal");
    // ingreso la coleccion que usare
    const coleccion = db.collection("usuarios");
    // obtengo la coleccion con "insertOne" inserto a MongoDB
    coleccion.insertOne(reqBodys, (err, result) => {
        // redirect al login para logearse
      res.redirect("/login");
    });
  });
});

//modulo exporto
module.exports = router;
