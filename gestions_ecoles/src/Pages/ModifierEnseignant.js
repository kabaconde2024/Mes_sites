import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Card, CardContent } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import SidebarAdmin from './SidebarAdmin';

const ModifierEnseignant = () => {
  const { id } = useParams(); // Récupère l'ID de l'élève depuis l'URL
  const [enseignant, setEleve] = useState({
    nom: '',
    prenom: '',
    email: '',
    matiere: '',
    telephone: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fonction pour récupérer les informations de l'élève
  const fetchEleve = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/enseignants/${id}`);
      setEleve(response.data);
    } catch (err) {
      console.error('Erreur lors de la récupération des informations de l\'élève:', err);
      setError('Impossible de charger les informations de l\'élève.');
    }
  };

  // Fonction pour mettre à jour l'élève
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/enseignants/${id}`, enseignant);
      alert('Élève mis à jour avec succès.');
      navigate('/ListeEnseignant'); // Redirection vers la liste des élèves
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      setError('Impossible de mettre à jour l\'élève.');
    }
  };

  // Gestion des changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEleve({ ...enseignant, [name]: value });
  };

  useEffect(() => {
    fetchEleve();
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <SidebarAdmin />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f5f5f5', p: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Modifier les informations de l'élève
            </Typography>
            {error && <Typography color="error">{error}</Typography>}
            <form onSubmit={handleUpdate}>
              <TextField
                label="Nom"
                name="nom"
                value={enseignant.nom}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Prénom"
                name="prenom"
                value={enseignant.prenom}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Email"
                name="email"
                value={enseignant.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
               <TextField
                label="Matiere"
                name="matiere"
                value={enseignant.matiere}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Téléphone"
                name="telephone"
                value={enseignant.telephone}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
             
              <Box sx={{ mt: 2 }}>
                <Button type="submit" variant="contained" color="primary" sx={{ marginRight: 1 }}>
                  Mettre à jour
                </Button>
                <Button variant="contained" color="secondary" onClick={() => navigate('/ListeEnseignant')}>
                  Annuler
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default ModifierEnseignant;
