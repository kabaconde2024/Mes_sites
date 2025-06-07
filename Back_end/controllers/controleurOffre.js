const Offre = require('../models/Offre');  
const { io } = require('../serveur'); // Assurez-vous d'importer l'instance de socket.io  

// Ajouter une nouvelle offre  
exports.ajouterOffre = async (req, res) => {  
    const { titre, description } = req.body;  

    try {  
        const nouvelleOffre = new Offre({ titre, description });  
        await nouvelleOffre.save();  

        // Émettre un événement lors de l'ajout de l'offre  
       // io.emit('nouvelleOffre', nouvelleOffre);  

        res.status(201).json(nouvelleOffre);  
    } catch (err) {  
        res.status(500).json({ message: "Erreur lors de l'ajout de l'offre.", error: err });  
    }  
};  

// Obtenir toutes les offres  
exports.obtenirToutesLesOffres = async (req, res) => {  
    try {  
        const offres = await Offre.find();  
        res.json(offres);  
    } catch (err) {  
        res.status(500).json({ message: "Erreur lors de la récupération des offres.", error: err });  
    }  
};  

// Supprimer une offre  
exports.supprimerOffre = async (req, res) => {  
    try {  
        const offreSupprimee = await Offre.findByIdAndDelete(req.params.id);  

        // Émettre un événement lors de la suppression de l'offre  
        if (offreSupprimee) {  
            io.emit('offreSupprimee', req.params.id); // Émettre l'ID de l'offre supprimée  
        }  

        res.json({ message: "Offre supprimée avec succès." });  
    } catch (err) {  
        res.status(500).json({ message: "Erreur lors de la suppression de l'offre.", error: err });  
    }  
};