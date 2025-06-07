import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SidebarAdmin from './SidebarAdmin';
import Header from './Header';

const ListeEleve = () => {
  const [eleves, setEleves] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fonction pour récupérer la liste des élèves
  const fetchEleves = async () => {  
    const token = localStorage.getItem('token');  
    console.log('Token:', token);  
    try {  
        const response = await axios.get('http://localhost:5000/api/eleves', {  
            headers: {  
                Authorization: `Bearer ${token}`,  
            },  
        });  
        setEleves(response.data); // Mettre à jour l'état avec les données reçues
    } catch (error) {  
        console.error('Erreur lors de la récupération des élèves:', error);  
        setError('Erreur lors de la récupération des élèves.'); // Afficher un message d'erreur
    }  
};

  // Fonction pour supprimer un élève
  const handleDelete = async (id) => {
    const token = localStorage.getItem('token'); // Récupération du token
    console.log('ID à supprimer:', id);
    if (id && window.confirm('Voulez-vous vraiment supprimer cet élève ?')) {
        try {
            await axios.delete(`http://localhost:5000/api/eleves/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Ajoutez le token ici
                },
            });
            setEleves(eleves.filter((eleve) => eleve._id !== id)); // Utiliser _id pour filtrer
        } catch (err) {
            console.error('Erreur lors de la suppression:', err);
            setError('Erreur lors de la suppression de l\'élève.');
        }
    } else {
        console.error('ID invalide pour la suppression');
    }
};


  // Redirection vers la page de modification
  const handleEdit = (id) => {
    navigate(`/ModifierEleve/${id}`);
  };

  useEffect(() => {
    fetchEleves();
  }, []);

  return (
    <Box sx={{  display: 'flex', flex: 1, pt: '64px', height: 'calc(100vh - 64px)'  }}>
        <Header />
      <SidebarAdmin />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f5f5f5', p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>Liste des Élèves</Typography>
                {error && <Typography color="error">{error}</Typography>}
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Nom</strong></TableCell>
                        <TableCell><strong>Prénom</strong></TableCell>
                        <TableCell><strong>Email</strong></TableCell>
                        <TableCell><strong>Téléphone</strong></TableCell>
                        <TableCell><strong>Classe</strong></TableCell>
                        <TableCell><strong>Actions</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {eleves.map((eleve) => (
                        <TableRow key={eleve._id}>
                          <TableCell>{eleve.nom}</TableCell>
                          <TableCell>{eleve.prenom}</TableCell>
                          <TableCell>{eleve.email}</TableCell>
                          <TableCell>{eleve.telephone}</TableCell>
                          <TableCell>{eleve.classe}</TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleEdit(eleve._id)}
                              sx={{ marginRight: 1 }}
                            >
                              Modifier
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              onClick={() => handleDelete(eleve._id)}
                            >
                              Supprimer
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ListeEleve;
