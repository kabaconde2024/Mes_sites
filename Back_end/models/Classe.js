const mongoose = require('mongoose');

const classeSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    unique: true
  },
  niveau: {
    type: String,
    required: true,
    enum: ['6ème', '5ème', '4ème', '3ème', '2nde', '1ère', 'Terminale']
  },
 matieres: [{
  matiere: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Matiere'
  },
  enseignant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enseignant'
  }
}],
  createdAt: {
    type: Date,
    default: Date.now
  }
});
module.exports = mongoose.model('Classe', classeSchema);