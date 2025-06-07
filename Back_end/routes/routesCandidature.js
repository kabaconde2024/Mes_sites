const express = require('express');
const { postulerOffre } = require('../controllers/controleurCandidature');
const router = express.Router();
const verifierToken = require('../middleware/verifierToken'); // Import du middleware verifierToken
const verifierRole = require('../middleware/verifierRole') ;// Import du middleware verifierRole  
const { getCandidatures } = require('../controllers/controleurCandidature');

router.post('/postuler',verifierToken, postulerOffre);
router.get('/candidatures', verifierToken,verifierRole(['admin']), getCandidatures);

module.exports = router;
