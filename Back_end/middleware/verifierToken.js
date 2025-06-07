// verifierToken.js
const jwt = require('jsonwebtoken');

const verifierToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    console.log('URL de la requête:', req.originalUrl); // Log de l'URL
    console.log('Token reçu:', token); // Log du token
    if (!token) return res.status(401).json({ message: "Accès non autorisé." });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Token invalide." });
        req.user = user;
        next();
    });
};


module.exports = verifierToken; // Assurez-vous que cela est bien exporté
