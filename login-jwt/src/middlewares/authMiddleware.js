const jwt = require("jsonwebtoken");

function verificarToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            ok: false,
            message: "Token no enviado"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // info del usuario
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                ok: false,
                message: "Token expirado"
            });
        }

        return res.status(401).json({
            ok: false,
            message: "Token inválido"
        });
    }
}

module.exports = verificarToken;
