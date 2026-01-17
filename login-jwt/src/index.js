const express = require("express");
const path = require("path");

// 🔥 CARGAR .env UNA SOLA VEZ Y PRIMERO
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

// 🧪 PRUEBA REAL
console.log("🧪 DB_HOST en index =", process.env.DB_HOST);
console.log("🧪 DB_PORT en index =", process.env.DB_PORT);

// 🧑‍💻CONECTAMOS A LA BASE DE DATOS
const db = require("./db");
// CONSULTA A LA BASE DE DATOS AL ARRANCAR, MUESTRA LOS USUARIOS Y SUS CONTRASEÑAS
const sql = "SELECT Username, PassWord FROM USUARIOS";
db.query(sql, (err, results) => {
  if (err) {
    console.error("❌ Error consultando la tabla USUARIOS:");
    console.error(err);
  } else {
    console.log("📦 REGISTROS EN LA TABLA USUARIOS:");
    console.table(results);
  }
});
// DEFINIMOS RUTAS
const authRoutes = require("./routes/auth");

const app = express();
app.use(express.json());

//Prueba (Middleware) de enrutamiento para ver si el POSTMAN recibe las rutas
app.use((req, res, next) => {
  console.log("➡️ Petición recibida:", req.method, req.url);
  next();
});


// RUTAS DE AUTENTICACIÓN PARA EL REGISTRO Y LOGIN
app.use("/auth", authRoutes);
app.listen(3000, () => {
  console.log("🚀 Servidor corriendo en http://localhost:3000");
});
