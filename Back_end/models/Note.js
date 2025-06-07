// models/Note.js
const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  eleve: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Eleve',
    required: true
  },
  matiere: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Matiere',
    required: true
  },
  enseignant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enseignant',
    required: true
  },
  valeur: {
    type: Number,
    required: true,
    min: 0,
    max: 20
  },
  dateEvaluation: {
    type: Date,
    default: Date.now
  },
  commentaire: String,
  typeEvaluation: {
    type: String,
    enum: ['devoir', 'examen', 'projet', 'participation'],
    default: 'devoir'
  },
  periode: {  // Nouveau champ pour gérer les trimestres/semestres
    type: String,
    required: true,
    enum: ['trimestre1', 'trimestre2', 'trimestre3', 'semestre1', 'semestre2'],
    default: 'trimestre1'
  }
}, {
  timestamps: true
});

// Validation des relations
noteSchema.pre('save', async function(next) {
  const [matiere, eleve] = await Promise.all([
    mongoose.model('Matiere').findById(this.matiere),
    mongoose.model('Eleve').findById(this.eleve)
  ]);

  if (!matiere || !eleve) {
    throw new Error('Matière ou élève non trouvé');
  }

  if (!matiere.enseignants.includes(this.enseignant)) {
    throw new Error("Cet enseignant n'est pas assigné à cette matière");
  }

  next();
});

module.exports = mongoose.model('Note', noteSchema);