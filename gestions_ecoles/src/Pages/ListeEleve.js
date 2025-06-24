import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  useMediaQuery,
  useTheme,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SidebarAdmin from './SidebarAdmin';
import Header from './Header';

const ListeEleve = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [eleves, setEleves] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchEleves = async () => {  
    const token = localStorage.getItem('token');  
    const controller = new AbortController();
    
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get("https://mes-sites.onrender.com/api/eleves", {  
        headers: {  
          Authorization: `Bearer ${token}`,  
        },
        signal: controller.signal,
        timeout: 10000
      });
      
      if (!response.data) {
        throw new Error('Réponse vide du serveur');
      }
      
      const receivedData = Array.isArray(response.data) 
        ? response.data 
        : response.data.data || [];

      // Normalisation des données
      const normalizedData = receivedData.map(eleve => ({
        ...eleve,
        classeDisplay: typeof eleve.classe === 'object' 
          ? eleve.classe.nom 
          : eleve.classe || 'Non assigné',
        fullName: `${eleve.nom} ${eleve.prenom}`.trim()
      }));
      
      setEleves(normalizedData);
    } catch (error) {  
      if (error.name !== 'CanceledError' && error.name !== 'AbortError') {
        console.error('Erreur de récupération:', {
          message: error.message,
          response: error.response?.data,
          stack: error.stack
        });  
        setError(error.response?.data?.message || 
                error.message || 
                'Échec du chargement des élèves');
      }
    } finally {
      setLoading(false);
    }
    
    return () => controller.abort();
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (id && window.confirm('Voulez-vous vraiment supprimer cet élève ?')) {
      try {
        await axios.delete(`https://mes-sites.onrender.com/api/eleves/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEleves(prev => prev.filter(eleve => eleve._id !== id));
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        setError('Erreur lors de la suppression de l\'élève');
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/ModifierEleve/${id}`);
  };

  useEffect(() => {
    fetchEleves();
  }, []);

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh', 
      pt: { xs: '56px', sm: '64px' },
      bgcolor: '#f5f5f5'
    }}>
      <Header />
      <Box sx={{ 
        display: 'flex', 
        flex: 1, 
        flexDirection: { xs: 'column', sm: 'row' },
        width: '100%'
      }}>
        <SidebarAdmin />
        <Box component="main" sx={{ 
          flexGrow: 1, 
          p: { xs: 1, sm: 2, md: 3 },
          width: { xs: '100%', sm: 'auto' }
        }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card sx={{ 
                borderRadius: { xs: 0, sm: theme.shape.borderRadius },
                boxShadow: { xs: 'none', sm: theme.shadows[3] }
              }}>
                <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
                  <Typography 
                    variant={isMobile ? 'h6' : 'h5'} 
                    gutterBottom
                    sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                  >
                    Liste des Élèves
                  </Typography>
                  
                  {error && (
                    <Typography color="error" sx={{ mb: 2, fontSize: '0.875rem' }}>
                      {error}
                    </Typography>
                  )}
                  
                  {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <TableContainer 
                      component={Paper} 
                      sx={{ maxHeight: '70vh', overflowX: 'auto' }}
                    >
                      <Table stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', p: 1 }}>
                              {isMobile ? 'Nom complet' : 'Nom'}
                            </TableCell>
                            {!isMobile && (
                              <TableCell sx={{ fontWeight: 'bold', p: 1 }}>
                                Prénom
                              </TableCell>
                            )}
                            <TableCell sx={{ fontWeight: 'bold', p: 1 }}>
                              Email
                            </TableCell>
                            {!isMobile && (
                              <TableCell sx={{ fontWeight: 'bold', p: 1 }}>
                                Téléphone
                              </TableCell>
                            )}
                            {!isMobile && (
                              <TableCell sx={{ fontWeight: 'bold', p: 1 }}>
                                Classe
                              </TableCell>
                            )}
                            <TableCell sx={{ fontWeight: 'bold', p: 1 }}>
                              Actions
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {eleves.length > 0 ? (
                            eleves.map((eleve) => (
                              <TableRow key={eleve._id}>
                                <TableCell sx={{ p: 1 }}>
                                  {isMobile ? eleve.fullName : eleve.nom}
                                </TableCell>
                                {!isMobile && (
                                  <TableCell sx={{ p: 1 }}>
                                    {eleve.prenom}
                                  </TableCell>
                                )}
                                <TableCell sx={{ p: 1 }}>
                                  {eleve.email || '-'}
                                </TableCell>
                                {!isMobile && (
                                  <TableCell sx={{ p: 1 }}>
                                    {eleve.telephone || '-'}
                                  </TableCell>
                                )}
                                {!isMobile && (
                                  <TableCell sx={{ p: 1 }}>
                                    {eleve.classeDisplay}
                                  </TableCell>
                                )}
                                <TableCell sx={{ p: 1, display: 'flex', gap: 1 }}>
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleEdit(eleve._id)}
                                    size="small"
                                    sx={{ minWidth: '80px' }}
                                  >
                                    Modifier
                                  </Button>
                                  <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => handleDelete(eleve._id)}
                                    size="small"
                                    sx={{ minWidth: '80px' }}
                                  >
                                    Supprimer
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={6} sx={{ textAlign: 'center', p: 2 }}>
                                Aucun élève trouvé
                              </TableCell>
                            </TableRow>
                          )}
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
    </Box>
  );
};

export default ListeEleve;