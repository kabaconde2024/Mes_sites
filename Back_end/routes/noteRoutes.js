// routes/noteRoutes.js
const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const verifierToken = require('../middleware/verifierToken');
const verifierRole = require('../middleware/verifierRole');

// CRUD de base
router.post('/', verifierToken, verifierRole(['admin', 'enseignant']), noteController.createNote);
router.get('/', verifierToken, noteController.getAllNotes);
router.get('/:id', verifierToken, noteController.getNoteById);
router.put('/:id', verifierToken, verifierRole(['admin', 'enseignant']), noteController.updateNote);
router.delete('/:id', verifierToken, verifierRole(['admin']), noteController.deleteNote);

// Statistiques
router.get('/stats/globales', verifierToken, noteController.getNoteStats);

module.exports = router;