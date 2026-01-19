const express = require('express');
const app = express();

const {infoCursos} = require('./cursos');
app.get('/', (req, res) => {
    res.send("Servidor Express en marcha");
});

const PUERTO = process.env.PORT || 3000;

app.listen(PUERTO, () => {
    console.log(`El servidor está escuchando en el puerto ${PUERTO}`);
});