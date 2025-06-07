const Candidature = require('../models/Candidature');
const { io } = require('../serveur'); // Importer l'instance de socket.io
const mongoose = require('mongoose');

exports.postulerOffre = async (req, res) => {
    const { offreId, nomEleve, emailEleve } = req.body;
    const eleveId = req.user.id; // Assurez-vous que req.user est bien défini

    if (!mongoose.Types.ObjectId.isValid(offreId) || !mongoose.Types.ObjectId.isValid(eleveId)) {
        return res.status(400).json({ message: "ID d'offre ou d'élève invalide" });
    }

    try {
        const nouvelleCandidature = new Candidature({
            offreId,
            eleveId,
            nomEleve,
            emailEleve
        });

        await nouvelleCandidature.save();

        io.emit('nouvelleCandidature', nouvelleCandidature);

        res.status(201).json({ message: 'Candidature envoyée avec succès', candidature: nouvelleCandidature });
    } catch (err) {
        console.error('Erreur lors de la postulation:', err);
        res.status(500).json({ message: "Erreur lors de la postulation", error: err });
    }
};

exports.getCandidatures = async (req, res) => {
    try {
        // Si l'admin souhaite récupérer les candidatures pour une offre spécifique
        const { offreId } = req.query; // Peut être passé en paramètre de requête
        let candidatures;

        if (offreId && mongoose.Types.ObjectId.isValid(offreId)) {
            // Recherche des candidatures pour une offre spécifique
            candidatures = await Candidature.find({ offreId });
        } else {
            // Récupère toutes les candidatures
            candidatures = await Candidature.find();
        }

        res.status(200).json(candidatures);
    } catch (err) {
        console.error('Erreur lors de la récupération des candidatures:', err);
        res.status(500).json({ message: 'Erreur lors de la récupération des candidatures', error: err });
    }
};