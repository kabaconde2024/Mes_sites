// verifierRole.js
const verifierRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(403).json({ message: "Utilisateur non authentifié." });
        }
        const userRole = req.user.role; // Assurez-vous que req.user est défini
        if (!roles.includes(userRole)) {
            return res.status(403).json({ message: "Accès refusé." });
        }
        next();
    };
};



module.exports = verifierRole; // Assurez-vous que cela est bien exporté
