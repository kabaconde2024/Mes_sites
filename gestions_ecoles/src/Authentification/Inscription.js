import React, { useState } from 'react';
import { Button, TextField, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import d'axios

const SignupForm = () => {
  const navigate = useNavigate();

  // États pour les champs de saisie
  const [nomUtilisateur, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [cin, setCin] = useState(''); // State for CIN

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Envoi des données d'inscription au backend
      const response = await axios.post('http://localhost:5000/api/auth/inscription', {
        nomUtilisateur,
        email,
        motDePasse,
        cin
      });

      // Si l'inscription réussit, redirection vers la page de connexion
      console.log("Inscription réussie !");
      navigate('/'); // Redirige vers la page de connexion
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      alert('Erreur lors de l\'inscription.');
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="#f5f5f5"
    >
      <Box
        width="100%"
        maxWidth="400px"
        p={4}
        bgcolor="white"
        borderRadius={2}
        boxShadow={3}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Inscription
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nom"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            value={nomUtilisateur}
            onChange={(e) => setNom(e.target.value)}
          />
         <TextField label="CIN" variant="outlined" fullWidth margin="normal" required value={cin} onChange={(e) => setCin(e.target.value)} />

          <TextField
            label="Email"
            variant="outlined"
            type="email"
            fullWidth
            margin="normal"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Mot de passe"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            required
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            S'inscrire
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default SignupForm;
