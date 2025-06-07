// models/Matiere.js
const mongoose = require('mongoose');

const matiereSchema = new mongoose.Schema({
  nom: { 
    type: String, 
    required: true,
    unique: true
  },
 
  description: String,
  coefficient: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  enseignants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enseignant'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Matiere', matiereSchema);