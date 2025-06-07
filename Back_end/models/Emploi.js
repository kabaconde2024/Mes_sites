// models/EmploiDuTemps.js
const mongoose = require('mongoose');

const emploiDuTempsSchema = new mongoose.Schema({
  jour: { type: String, required: true },
  horaire_debut: { type: String, required: true },
  horaire_fin: { type: String, required: true },
  matiere: { type: String, required: true },
  enseignant: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Enseignant',
    required: true 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Emploi', emploiDuTempsSchema);