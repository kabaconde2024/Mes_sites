import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SidebarAdmin from './SidebarAdmin';
import Header from './Header';

const ListeEnseignant = () => {
  const [enseignants, setEnseignants] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fonction pour récupérer la liste des enseignants
  const fetchEnseignants = async () => {
    setLoading(true);
    const token = localStorage.getItem('token'); // Récupération du token
    try {
      const response = await axios.get('http://localhost:5000/api/enseignants/listes', {
        headers: { Authorization: `Bearer ${token}` }, // Ajout du token dans les en-têtes
      });
      setEnseignants(response.data);
    } catch (err) {
      console.error('Erreur lors de la récupération des enseignants:', err);
      setError('Impossible de récupérer les enseignants.');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour supprimer un enseignant
  const handleDelete = async (id) => {
    const token = localStorage.getItem('token'); // Récupération du token
    console.log('ID à supprimer:', id);
    if (id && window.confirm('Voulez-vous vraiment supprimer cet enseignant ?')) {
      try {
        await axios.delete(`http://localhost:5000/api/enseignants/${id}`, {
          headers: { Authorization: `Bearer ${token}` }, // Ajout du token ici
        });
        setEnseignants(enseignants.filter((enseignant) => enseignant._id !== id)); // Utiliser _id pour filtrer
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        setError('Erreur lors de la suppression de l\'enseignant.');
      }
    } else {
      console.error('ID invalide pour la suppression');
    }
  };

  // Redirection vers la page de modification
  const handleEdit = (id) => {
    navigate(`/ModifierEnseignant/${id}`);
  };

  useEffect(() => {
    fetchEnseignants();
  }, []);

  return (
    <Box sx={{  display: 'flex', flex: 1, pt: '64px', height: 'calc(100vh - 64px)'}}>
      <Header/>
      <SidebarAdmin />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f5f5f5', p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>Liste des Enseignants</Typography>
                {error && <Typography color="error">{error}</Typography>}
                {loading ? (
                  <CircularProgress />
                ) : (
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>Nom</strong></TableCell>
                          <TableCell><strong>Prénom</strong></TableCell>
                          <TableCell><strong>Email</strong></TableCell>
                          <TableCell><strong>Matière</strong></TableCell>
                          <TableCell><strong>Téléphone</strong></TableCell>
                          <TableCell><strong>Actions</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {enseignants.map((enseignant) => (
                          <TableRow key={enseignant._id}>
                            <TableCell>{enseignant.nom}</TableCell>
                            <TableCell>{enseignant.prenom}</TableCell>
                            <TableCell>{enseignant.email}</TableCell>
                            <TableCell>{enseignant.matiere}</TableCell>
                            <TableCell>{enseignant.telephone}</TableCell>
                            <TableCell>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleEdit(enseignant._id)}
                                sx={{ marginRight: 1 }}
                              >
                                Modifier
                              </Button>
                              <Button
                                variant="contained"
                                color="error"
                                onClick={() => handleDelete(enseignant._id)}
                              >
                                Supprimer
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ListeEnseignant;
