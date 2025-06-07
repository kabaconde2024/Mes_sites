const Paiement = require("../models/Paiement");

// Ajouter un paiement
exports.ajouterPaiement = async (req, res) => {
  const { eleveId, tranche, montant, anneeScolaire } = req.body;

  try {
    const nouveauPaiement = new Paiement({
      eleveId,
      tranche,
      montant,
      anneeScolaire,
    });
    await nouveauPaiement.save();
    res.status(201).json(nouveauPaiement);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'ajout du paiement.", error: err });
  }
};

// Obtenir tous les paiements d'un élève
exports.obtenirPaiementsParEleve = async (req, res) => {
  const { eleveId } = req.params;

  try {
    const paiements = await Paiement.find({ eleveId }).populate("eleveId");
    res.json(paiements);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des paiements.", error: err });
  }
};

exports.obtenirTousLesPaiements = async (req, res) => {
    try {
      const paiements = await Paiement.find().populate("eleveId");
      res.json(paiements);
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la récupération des paiements.", error: err });
    }
  };

// Mettre à jour un paiement
exports.mettreAJourPaiement = async (req, res) => {
  const { tranche, montant, statut, anneeScolaire } = req.body;

  try {
    const paiementMisAJour = await Paiement.findByIdAndUpdate(
      req.params.id,
      { tranche, montant, statut, anneeScolaire },
      { new: true }
    ).populate("eleveId");
    res.json(paiementMisAJour);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du paiement.", error: err });
  }
};

// Supprimer un paiement
exports.supprimerPaiement = async (req, res) => {
  try {
    await Paiement.findByIdAndDelete(req.params.id);
    res.json({ message: "Paiement supprimé avec succès." });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la suppression du paiement.", error: err });
  }
};
