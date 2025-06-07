const mongoose = require('mongoose');

const CandidatureSchema = new mongoose.Schema({
    offreId: { type: mongoose.Schema.Types.ObjectId, ref: 'Offre', required: true },
    eleveId: { type: mongoose.Schema.Types.ObjectId, ref: 'Eleve', required: true },
    nomEleve: { type: String, required: true },
    emailEleve: { type: String, required: true },
    datePostulation: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Candidature', CandidatureSchema);
