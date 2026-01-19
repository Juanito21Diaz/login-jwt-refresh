const express = require('express');
const app = express();

const {infoCursos} = require('./cursos');

//rutas
app.get('/', (req, res) => {
    res.send("Servidor Express en marcha");
});

app.get('/api/cursos', (req, res) => {
    res.send(JSON.stringify(infoCursos));
});

app.get('/api/cursos/programacion', (req, res) => {
    res.send(JSON.stringify(infoCursos.programacion));
});

app.get('/api/cursos/literatura', (req, res) => {
    res.send(JSON.stringify(infoCursos.literatura));
});

const PUERTO = process.env.PORT || 3000;

app.listen(PUERTO, () => {
    console.log(`El servidor está escuchando en el puerto ${PUERTO}`);
});