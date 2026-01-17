const express = require('express');
const app = express();

const {infoCursos} = require('./cursos');
app.get('/', (req, res) => {
    res.send("Servidor Express en marcha");
});