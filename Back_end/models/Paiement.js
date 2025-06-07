const mongoose = require("mongoose");

const paiementSchema = new mongoose.Schema(
  {
    eleveId: { type: mongoose.Schema.Types.ObjectId, ref: "Eleve", required: true },
    tranche: { type: String, required: true }, // Exemple: "Première Tranche"
    montant: { type: Number, required: true },
    datePaiement: { type: Date, default: Date.now },
    anneeScolaire: { type: String, required: true }, // Exemple: "2024-2025"
    statut: { type: String, enum: ["Payé", "En attente"], default: "Payé" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Paiement", paiementSchema);
