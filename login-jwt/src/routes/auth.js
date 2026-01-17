console.log("✅ auth.js fue cargado");

const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");
const verificarToken = require("../middlewares/authMiddleware");
const crypto = require("crypto");

// 🟢 REGISTRO DE USUARIO
router.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Validación básica
  if (!username || !password) {
    return res.status(400).json({
      message: "Username y password son obligatorios"
    });
  }

  const sql = "INSERT INTO USUARIOS (Username, PassWord) VALUES (?, ?)";

  db.query(sql, [username, password], (err, result) => {
    if (err) {
      console.error("❌ Error registrando usuario:", err);
      return res.status(500).json({
        message: "🥶 Error registrando usuario"
      });
    }

    res.status(201).json({
      message: "🤑 Usuario registrado correctamente",
      userId: result.insertId
    });
  });
});

// 🔐 LOGIN
router.post("/login", (req, res) => {
  const { Username, PassWord } = req.body;
  // Validación si existen los campos
  if (!Username || !PassWord) {
    return res.status(400).json({
      ok: false,
      message: "Username y PassWord son obligatorios",
    });
  }
  //Consulta de la base de datos basica
  const sql = "SELECT * FROM USUARIOS WHERE Username = ?";

  db.query(sql, [Username], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        ok: false,
        message: "Error en base de datos",
      });
    }
    // Verificar si el usuario existe
    if (results.length === 0) {
      return res.status(401).json({
        ok: false,
        message: "Usuario no existe",
      });
    }

    const user = results[0];

    // ⚠️ Verificar contraseña método facil y basico (en producción usar hashing)
    if (user.PassWord !== PassWord) {
      return res.status(401).json({
        ok: false,
        message: "Contraseña incorrecta",
      });
    }

    // 🔑 ACCESS TOKEN (vida corta)
    const accessToken = jwt.sign(
      {
        username: user.Username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30m",
      }
    );

    // 🔁 REFRESH TOKEN (vida larga, aleatorio)
    const refreshToken = crypto.randomBytes(64).toString("hex");

    // ⏱️ Fecha de expiración del refresh token (2 horas)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 2);

    // 💾 Guardar refresh token en BD
    const sqlRefresh = `
  INSERT INTO Refresh_tokens (username, token, expires_at)
  VALUES (?, ?, ?)
`;

    db.query(
      sqlRefresh,
      [user.Username, refreshToken, expiresAt],
      (err) => {
        if (err) {
          console.error("❌ Error guardando refresh token:", err);
          return res.status(500).json({
            ok: false,
            message: "Error generando sesión",
          });
        }

        res.json({
          ok: true,
          message: "✅ Súper excelente, Login exitoso",
          accessToken,
          refreshToken,
        });
      }
    );

  });
});

//🔒 Ruta protegida (Probamos si el token se expide)
router.get("/perfil", verificarToken, (req, res) => {
  res.json({
    ok: true,
    message: "✅ Ruta protegida accedida correctamente",
    user: req.user
  });
});

// 🔄 REFRESH TOKEN
router.post("/refresh", (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      ok: false,
      message: "Refresh token requerido",
    });
  }

  const sql = `
    SELECT * FROM Refresh_tokens
    WHERE token = ?
  `;

  db.query(sql, [refreshToken], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        ok: false,
        message: "Error en base de datos",
      });
    }

    if (results.length === 0) {
      return res.status(401).json({
        ok: false,
        message: "Refresh token inválido",
      });
    }

    const tokenDB = results[0];

    // ⏰ Verificar expiración
    const ahora = new Date();
    const expiracion = new Date(tokenDB.expires_at);

    if (ahora > expiracion) {
      return res.status(401).json({
        ok: false,
        message: "Refresh token expirado",
      });
    }

    // 🔑 NUEVO ACCESS TOKEN
    const newAccessToken = jwt.sign(
      { username: tokenDB.username },
      process.env.JWT_SECRET,
      { expiresIn: "30m" }
    );

    res.json({
      ok: true,
      message: "Access token renovado",
      accessToken: newAccessToken,
    });
  });
});


module.exports = router;

