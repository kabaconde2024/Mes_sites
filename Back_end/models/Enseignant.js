// models/Enseignant.js
const mongoose = require("mongoose");

const enseignantSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
 matiere: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enseignant'
  }],  telephone: { type: String, required: false },
  dateCreation: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Enseignant", enseignantSchema);
