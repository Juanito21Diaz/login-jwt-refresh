const http = require('http');

const Servidor = http.createServer((req, res) => {
    res.end('🤖 Servidor funcionando correctamente'); 
});

const PUERTO = 3200;
Servidor.listen(PUERTO, () => {
    console.log(`🚀 Servidor escuchando en el puerto ${PUERTO}`);
});