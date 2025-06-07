const express = require('express');
const router = express.Router();
const controleurAuth = require('../controllers/controleurAuth');
const { getUtilisateurs } = require('../controllers/controleurAuth');
// Routes d'authentification
router.post('/inscription', controleurAuth.inscription);
router.post('/connexion', controleurAuth.connexion);
router.get('/utilisateurs', getUtilisateurs);

module.exports = router;
