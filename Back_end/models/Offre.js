const mongoose = require('mongoose');  

// Modèle de l'offre  
const offreSchema = new mongoose.Schema({  
    titre: { type: String, required: true },  
    description: { type: String, required: true },  
    datePublication: { type: Date, default: Date.now },  
}, {  
    timestamps: true  
});  

// Création du modèle  
module.exports = mongoose.model('Offre', offreSchema);